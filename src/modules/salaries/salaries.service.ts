import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Salary } from './schemas/salary.schema';
import { Model } from 'mongoose';
import { TeachingLog } from '../teaching_logs/schemas/teaching_log.schema';
import { Classroom } from '../classrooms/schemas/classroom.schema';
import { AllowanceDetail } from '../allowance-details/schemas/allowance-detail.schema';
import { Quota } from '../quotas/schemas/quota.schema';
import { Lecturer } from '../lecturers/schemas/lecturer.schema';
import { Subject } from '../subjects/schemas/subject.schema';
import { Timetable } from '../timetables/schemas/timetable.schema';
import { Allowance } from '../allowances/schemas/allowance.schema';
import { AllowanceDetailsService } from '../allowance-details/allowance-details.service';

@Injectable()
export class SalariesService {
  constructor(
        @InjectModel(Salary.name) private salaryModel: Model<Salary>,
        @InjectModel(TeachingLog.name) private teachingLogModel: Model<TeachingLog>,
        @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
        @InjectModel(Quota.name) private quotaModel: Model<Quota>,
        @InjectModel(Lecturer.name) private lecturerModel: Model<Lecturer>,
        @InjectModel(AllowanceDetail.name) private allowanceDetailModel: Model<AllowanceDetail>,
        @InjectModel(Subject.name) private subjectModel: Model<Subject>,
        @InjectModel(Timetable.name) private timetableModel: Model<Timetable>,
        @InjectModel(Allowance.name) private allowanceModel: Model<Allowance>,
        private readonly allowanceDetailsService: AllowanceDetailsService,
  ) {}
  
  // Hệ số lớp dựa trên số lượng sinh viên
  getClassCoefficient(studentCount: number): number {
    if (studentCount <= 70) return 1.0;
    if (studentCount <= 80) return 1.2;
    return 1.5;
  }

  // Tính tiền giảng lý thuyết
  calculateTeachingSalary(lesson_count: number, studentCount: number, rate: number): number {
    const coefficient = this.getClassCoefficient(studentCount);
    return lesson_count * coefficient * rate;
  }
  // Tính tiền giảng thực hành
  calculatePracticeSalary(lesson_count: number, rate: number): number {
    return lesson_count * 0.8 * rate;
  }
  // Tính tiền chấm bài điều kiện
  calculateGradingAllowance(studentCount: number): number {
    return studentCount * 10000; 
  }
  
  // Chi phí đi lại
  calculateTravelAllowance(quantity: number, rate: number): number {
    return quantity * rate;
  }
  
  // Phụ cấp ăn T7/CN (Cả ngày)
  calculateMealAllowance(days: number, rate: number): number {
    return days * rate; // Định mức ăn cả ngày
  }
  
  //Phụ cấp ăn T7/CN/Tối (1 buổi)
  calculateEveningMealAllowance(sessions: number, rate: number): number {
    return sessions * rate;
  }

  // Tính lương
  async calculateSalary(lecturerId: string, timetableId: string): Promise<any> {
    const classes = await this.classroomModel.find({ 
      lecturer_id: lecturerId,
      timetable_id: timetableId,
    }).lean();

    if (!classes.length) return { message: 'Không có lớp học nào' };

    const lecturer = await this.lecturerModel.findOne({lecturer_id: lecturerId}).lean();
    if(!lecturer) return { message: 'Không tìm thấy giảng viên!'}

    const rate = await this.quotaModel.findOne({ quota_id: lecturer.quota_id }).lean();
    if (!rate) return { message: 'Không tìm thấy định mức giảng dạy' };

    let totalSalary = 0;
    let classSalaryMap = new Map();
    let classHasPractice = new Set(); // Lưu danh sách lớp LT có lớp TH
    // Xác định trước lớp LT nào có lớp TH tương ứng
    for (const cls of classes) {
      if (cls.class_id.endsWith("_TH")) {
          let baseClassId = cls.class_id.replace(/_TH$/, "_LT");
          classHasPractice.add(baseClassId);
      }
    }
  
    for (const cls of classes) {
      const teachingLogs = await this.teachingLogModel.find({ class_id: cls.class_id }).lean();
      if (!teachingLogs || teachingLogs.length === 0) {
        console.warn(`Không có teaching logs cho lớp ${cls.class_id}, bỏ qua lớp này.`);
        continue;
      }
      let teachingSalary = 0;
      let gradingAllowance = 0;
      let travelAllowance = 0;
      let mealAllowance = 0;
      let eveningMealAllowance = 0;

      // Tính tiền giảng dạy lý thuyết
      const subject = await this.subjectModel.findOne({ subject_id: cls.subject_id }).lean();
      if (!classes.length) return { message: 'Không có môn học nào!' };
      const lessonData = await this.allowanceDetailsService.calculateMinimumLessons(teachingLogs[0].teaching_log_id,lecturerId);
      // Kiểm tra nếu lessonData hợp lệ trước khi truy cập thuộc tính
      if (!lessonData || !lessonData.min_lessons_breakdown) {
        console.error(`Không tìm thấy dữ liệu bài giảng cho giảng viên ${lecturerId}`);
        return { message: 'Không có dữ liệu bài giảng!' };
      }

      let baseClassId = cls.class_id.replace(/_TH$/, "_LT");

      // Tìm thông tin lớp trong min_lessons_breakdown
      const classInfo = lessonData?.min_lessons_breakdown.find(cl => cl.class_id === baseClassId);

      if (!classInfo) {
        console.error(`Không tìm thấy thông tin lớp ${baseClassId} trong dữ liệu`);
        return { message: `Không tìm thấy thông tin lớp ${baseClassId}` };
      }

      let nfCredit = classInfo.min_lessons;
      if (cls.class_id.endsWith("_TH")) {
        let ltClassSalary = classSalaryMap.get(baseClassId);
        if (!ltClassSalary) {
          // Nếu chưa có lớp LT, khởi tạo trước với giá trị mặc định
          ltClassSalary = {
              class_id: baseClassId,
              teachingSalary: 0,
              gradingAllowance: 0,
              travelAllowance: 0,
              mealAllowance: 0,
              eveningMealAllowance: 0,
              totalClassSalary: 0
          };
        }
        // Cộng tiền giảng dạy thực hành vào lớp LT
        let practiceSalary = this.calculatePracticeSalary(nfCredit, parseInt(rate.value, 10));
        ltClassSalary.teachingSalary += practiceSalary;

        ltClassSalary.totalClassSalary += practiceSalary;
        classSalaryMap.set(baseClassId, ltClassSalary);
        continue; // Bỏ qua việc tạo mới mục breakdown cho lớp _TH
      }else{
        // Nếu là lớp lý thuyết và có lớp thực hành, giảm 1 tín chỉ
        if (classHasPractice.has(cls.class_id)) {
          nfCredit = nfCredit;
        }
        teachingSalary += this.calculateTeachingSalary(nfCredit, cls.student_count, parseInt(rate.value, 10));
      }
      // Lấy phụ cấp từ bảng `allowance_details`
      const allowanceDetails = await this.allowanceDetailModel.find({ teaching_log_id: { $in: teachingLogs.map(l => l.teaching_log_id) } }).lean();
      for (const allowance of allowanceDetails) {
        if (allowance.allowance_id === 'PC002') {
          travelAllowance += this.calculateTravelAllowance(allowance.quantity, 70000);
        }
        if (allowance.allowance_id === 'PC004') {
          mealAllowance += this.calculateMealAllowance(allowance.quantity, 75000);
        }
        if (allowance.allowance_id === 'PC003') {
          eveningMealAllowance += this.calculateEveningMealAllowance(allowance.quantity, 75000);
        }
        if(allowance.allowance_id === 'PC001'){
          gradingAllowance += this.calculateGradingAllowance(allowance.quantity);
        }
      }

      const totalClassSalary = teachingSalary + gradingAllowance + travelAllowance + mealAllowance + eveningMealAllowance;
      totalSalary += totalClassSalary;

      if (!classSalaryMap.has(baseClassId)) {
        classSalaryMap.set(baseClassId, {
            class_id: cls.class_id,
            teachingSalary,
            gradingAllowance,
            travelAllowance,
            mealAllowance,
            eveningMealAllowance,
            totalClassSalary
        });
      } else {
          let existingClass = classSalaryMap.get(baseClassId);
          existingClass.teachingSalary += teachingSalary;
          existingClass.gradingAllowance += gradingAllowance;
          existingClass.travelAllowance += travelAllowance;
          existingClass.mealAllowance += mealAllowance;
          existingClass.eveningMealAllowance += eveningMealAllowance;
          existingClass.totalClassSalary += totalClassSalary;
          classSalaryMap.set(baseClassId, existingClass);
      }
    }

    return {
      lecturerId,
      timetable_id: timetableId.toString(),
      totalSalary,
      breakdown: Array.from(classSalaryMap.values()),
    };
  } 

  async updateOrCreateSalary(lecturerId: string, timetableId: string): Promise<any> {
    // Tính lương cho giảng viên trong học kỳ, năm học được chỉ định
    const salaryData = await this.calculateSalary(lecturerId, timetableId);
  
    // Nếu không có dữ liệu lương
    if (!salaryData.totalSalary) {
      return { message: 'Không có dữ liệu lương để cập nhật cho học kỳ này' };
    }
  
    // Kiểm tra bản ghi lương hiện có của giảng viên cho học kỳ, năm học đó
    const existingSalary = await this.salaryModel.findOne({
      lecturer_id: lecturerId,
      timetable_id: timetableId,
    });
  
    if (existingSalary) {
      // Cập nhật lại bản ghi lương
      await this.salaryModel.updateOne(
        { lecturer_id: lecturerId, timetable_id: timetableId },
        { 
          $set: {
            total_salary: salaryData.totalSalary,
            breakdown: salaryData.breakdown,
            updatedAt: new Date(),
          }
        }
      );
      return { message: 'Cập nhật lương thành công!', salary: salaryData };
    } else {
      // Tạo mới bản ghi lương
      const newSalary = new this.salaryModel({
        lecturer_id: lecturerId,
        timetable_id: timetableId,
        total_salary: salaryData.totalSalary,
        breakdown: salaryData.breakdown,
        is_paid: false, // Mặc định là chưa thanh toán
        updatedAt: new Date(),
      });
      await newSalary.save();
      return { message: 'Tạo mới lương thành công!', salary: salaryData };
    }
  }

  async getSalaryByLecturerId(lecturerId: string, academic_year: string): Promise<any> {
    const timetable = await this.timetableModel.find({academic_year: academic_year}).lean();
    if (timetable.length ===0) {
      return { message: 'Không có dữ liệu thời khóa biểu!' };
    }

    const timetableMap = new Map(
      timetable.map(timetable => [timetable.timetable_id, timetable.semester])
    );
    const timetableIds = Array.from(timetableMap.keys());
    const salaries = await this.salaryModel.find({
      lecturer_id: lecturerId,
      timetable_id: { $in: timetableIds }
    }).lean();
  
    if (salaries.length === 0) {
      return { message: 'Không có dữ liệu lương!' };
    }
    const salariesWithSemester = salaries.map(salary => ({
      ...salary,
      semester: timetableMap.get(salary.timetable_id) || "Không xác định" // Gán semester từ map
    }));
    return {
      academic_year,
      salaries: salariesWithSemester
    };
  }

  async getSalaryDetail(id: string): Promise<any> {
    const salary = await this.salaryModel.findById(id).lean();
    if (!salary) {
        throw new NotFoundException("Không tìm thấy dữ liệu lương!");
    }
    return salary;
  } 
  
  async getDetailsSalary(classId: string): Promise <any> {
    const salary = await this.salaryModel.findOne({
      "breakdown.class_id": classId
    }).lean();
    if (!salary) {
      return null;
    }
    const lecturer = await this.lecturerModel.findOne({lecturer_id: salary.lecturer_id}).lean();
    if(!lecturer.quota_id) return { message: 'Không tìm mã định mức của giảng viên!'}
    const quota = await this.quotaModel.findOne({quota_id: lecturer.quota_id});
    if(!quota.quota_id) return { message: 'Không tìm mã định mức của giảng viên!'}
    const classroom = await this.classroomModel.findOne({class_id: classId}).lean();
    if(!classroom.student_count) return { message: 'Không tìm thấy lớp học!'}

    const subject = await this.subjectModel.findOne({subject_id: classroom.subject_id}).lean();
    if(!subject.subject_id) return { message: 'Không tìm thấy môn học!'}

    // Lọc ra đúng breakdown chứa class_id đó
    const breakdown = salary.breakdown.find((item) => item.class_id === classId);

    const teachingLog = await this.teachingLogModel.findOne({class_id: classId}).lean();
    if(!teachingLog.teaching_log_id) return { message: 'Không tìm mã theo dõi giảng dạy!'}

    const allowanceDetails = await this.allowanceDetailModel.find({teaching_log_id: teachingLog.teaching_log_id}).lean();
    if (!allowanceDetails.length) {
      return { message: 'Không có phụ cấp nào cho lớp này!' };
    }

     // Lấy danh sách allowance_id từ allowanceDetails
    const allowanceIds = allowanceDetails.map((detail) => detail.allowance_id);
    // Tìm danh sách allowance dựa vào allowance_id
    const allowances = await this.allowanceModel.find({
      allowance_id: { $in: allowanceIds }
    }).lean();

    const LessonData = await this.allowanceDetailsService.calculateMinimumLessons(teachingLog.teaching_log_id, lecturer.lecturer_id);
    const classInfo = LessonData?.min_lessons_breakdown.find(cl => cl.class_id === classroom.class_id);

    const mergedAllowances = allowanceDetails.map((detail) => {
      const allowance = allowances.find((a) => a.allowance_id === detail.allowance_id);
      return {
          allowance_id: detail.allowance_id,
          allowance_name: allowance ? allowance.allowance_name : "Unknown",
          quantity: detail.quantity,
          allowance_value: allowance.allowance_value,
      };
    });

    return {
      lecturer_id: salary.lecturer_id,
      timetable_id: salary.timetable_id,
      quota_value: quota.value,
      student_count: classroom.student_count,
      nfCredit: subject.nfCredit,
      min_lessons: classInfo.min_lessons,
      is_paid: salary.is_paid,
      total_salary: salary.total_salary,
      breakdown,
      allowances: mergedAllowances
    };
  }

  create(createSalaryDto: CreateSalaryDto) {
    return 'This action adds a new salary';
  }

  findAll() {
    return `This action returns all salaries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salary`;
  }

  update(id: number, updateSalaryDto: UpdateSalaryDto) {
    return `This action updates a #${id} salary`;
  }

  remove(id: number) {
    return `This action removes a #${id} salary`;
  }
}
