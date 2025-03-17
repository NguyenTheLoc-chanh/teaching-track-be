import { Injectable } from '@nestjs/common';
import { CreateAllowanceDetailDto } from './dto/create-allowance-detail.dto';
import { UpdateAllowanceDetailDto } from './dto/update-allowance-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AllowanceDetail } from './schemas/allowance-detail.schema';
import { Date, Model } from 'mongoose';
import { TeachingLog } from '../teaching_logs/schemas/teaching_log.schema';
import * as dayjs from 'dayjs';
import { Classroom } from '../classrooms/schemas/classroom.schema';
import { Subject } from '../subjects/schemas/subject.schema';
import { Lecturer } from '../lecturers/schemas/lecturer.schema';

@Injectable()
export class AllowanceDetailsService {
  constructor(
    @InjectModel(AllowanceDetail.name) private allowanceDetailModel: Model<AllowanceDetail>,
    @InjectModel(TeachingLog.name) private teachingLoglModel: Model<TeachingLog>,
    @InjectModel(Classroom.name) private classroomlModel: Model<Classroom>,
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
    @InjectModel(Lecturer.name) private lecturerModel: Model<Lecturer>,
  ) {}

  async create(createAllowanceDetailDto: CreateAllowanceDetailDto) {
    const {allowance_id, teaching_log_id, quantity} = createAllowanceDetailDto;

    const allowanceDetail = await this.allowanceDetailModel.create({
      allowance_id, teaching_log_id, quantity
    })
    return {
      _id: allowanceDetail._id
    };
  }
  // Cập nhật 
  async updateAllowanceDetail(dataAllowances: {allowanceIds: string[], trackingId: string}) {
    const { allowanceIds, trackingId } = dataAllowances;
    if (!allowanceIds || allowanceIds.length === 0) {
      return { message: "No allowance IDs provided" };
    }
    try {
      let results = [];
  
      for (const allowanceId of allowanceIds) {
        let newQuantity = 1; 
        let currentQuantity = 0;

        // Tìm bản ghi hiện tại
        const allowanceDetail = await this.allowanceDetailModel.findOne({
          allowance_id: allowanceId,
          teaching_log_id: trackingId
        }).lean();
        if(allowanceId === "PC001"){
          const teachingLog = await this.teachingLoglModel.findOne({ teaching_log_id: trackingId }).lean();
          if (!teachingLog) {
            console.log(`Không tìm thấy teaching log với ID: ${trackingId}`);
            continue;
          }
          const classroom = await this.classroomlModel.findOne({ class_id: teachingLog.class_id }).lean();
          if (classroom && classroom.student_count) {
            newQuantity = classroom.student_count; 
          } else {
            newQuantity = currentQuantity;
          }
        }else{
           // Lấy quantity hiện tại (nếu chưa có thì mặc định là 0)
          currentQuantity = allowanceDetail ? allowanceDetail.quantity : 0;
          newQuantity = currentQuantity + 1;
        }
        console.log(`Updating ${allowanceId}: ${currentQuantity} -> ${newQuantity}`);
  
        // Cập nhật hoặc tạo mới nếu chưa có
        const updatedAllowanceDetail = await this.allowanceDetailModel.findOneAndUpdate(
          { allowance_id: allowanceId, teaching_log_id: trackingId },
          { $set: { quantity: newQuantity } },
          { new: true, upsert: true }
        );
  
        results.push(updatedAllowanceDetail);
      }
      return results;
    } catch (error) {
      throw new Error(`Error updating allowance detail: ${error.message}`);
    }
  }

  async calculateMinimumLessons(teachingLogId: string, lecturerId: string) {
    const teachingLogs = await this.teachingLoglModel.find({ teaching_log_id: teachingLogId }).lean();
  
    if (!teachingLogs.length) {
      return { message: "Không tìm thấy dữ liệu giảng dạy" };
    }
  
    // Lấy thông tin môn học từ classModel
    const classIds = teachingLogs.map((log) => log.class_id);
    const classes = await this.classroomlModel.find({ class_id: { $in: classIds } }).lean();
  
    // Lấy danh sách subject_id
    const subjectIds = classes.map((cls) => cls.subject_id);
    const subjects = await this.subjectModel.find({ subject_id: { $in: subjectIds } }).lean();
  
    // Tạo danh sách min_lessons
    let minLessonsBreakdown = teachingLogs.map((log) => {
      const classInfo = classes.find((cls) => cls.class_id === log.class_id);
      const subjectInfo = subjects.find((sub) => sub.subject_id === classInfo?.subject_id);
  
      return {
        class_id: log.class_id,
        subject_id: subjectInfo?.subject_id || "Unknown",
        subject_name: subjectInfo?.name || "Unknown",
        credit: subjectInfo?.nfCredit || 0,
        total_lessons: (subjectInfo?.nfCredit || 0) * 15, // 1 tín chỉ = 15 tiết
        required_lessons: 0,
        min_lessons: 0,
      };
    });
  
    // **Nhóm theo class_id để chỉ lấy lớp _LT**
    const groupedByClassId = minLessonsBreakdown.reduce((acc, item) => {
      const baseClassId = item.class_id.replace(/_(LT|TH)$/, ''); // Loại bỏ hậu tố _LT hoặc _TH
      if (!acc[baseClassId]) {
        acc[baseClassId] = [];
      }
      acc[baseClassId].push(item);
      return acc;
    }, {} as Record<string, any[]>);
  
    // **Chỉ lấy lớp _LT nếu có cả _LT và _TH**
    minLessonsBreakdown = Object.values(groupedByClassId)
      .map((group) => group.find((item) => item.class_id.endsWith('_LT')) || group[0])
      .filter(Boolean); // Loại bỏ giá trị null
    
    // Lấy thông tin giảng viên
    const lecturer = await this.lecturerModel.findOne({ lecturer_id: lecturerId }).lean();
    
    // **Tính tổng số tiết trong kỳ**
    const totalLessons = minLessonsBreakdown.reduce((sum, item) => sum + item.total_lessons, 0);
    const MIN_REQUIRED_LESSONS = lecturer.minofper / 2; // Số tiết tối thiểu trong kỳ
    const excessLessons = totalLessons > MIN_REQUIRED_LESSONS ? totalLessons - MIN_REQUIRED_LESSONS : 0; // Số tiết vượt

    // **Chia số tiết vượt theo số tín chỉ**
    const totalCredits = minLessonsBreakdown.reduce((sum, item) => sum + item.credit, 0);
    minLessonsBreakdown = minLessonsBreakdown.map((item) => {
      const min_lessons = excessLessons > 0 ? Math.round((item.credit / totalCredits) * excessLessons) : 0;
      return {
        ...item,
        min_lessons: min_lessons,
        required_lessons: item.total_lessons - min_lessons, // Số tiết cần dạy của môn
      };
    });

    return {
      teaching_log_id: teachingLogId,
      total_credits: totalCredits,
      total_lessons: totalLessons,
      excess_lessons: excessLessons,
      min_lessons_breakdown: minLessonsBreakdown,
    };
  }

  async determineAllowance(teachinglog_id: string, date: string,lecturerId: string) {
    try {
      const lessonData = await this.calculateMinimumLessons(teachinglog_id, lecturerId);  

      const teachingLogs = await this.teachingLoglModel.find({ 
        teaching_log_id: teachinglog_id,
        date: date,
      }).lean();
      const teachingLogConfirm = teachingLogs.filter(log => log.session_status === "Confirmed");
  
      if (!Array.isArray(teachingLogs) || teachingLogs.length === 0) {
        throw new Error('Teaching log not found');
      }

      if (!teachingLogConfirm.length) {
        throw new Error('Không tìm thấy lịch giảng dạy hoặc chưa được xác nhận');
      }

      const classId = teachingLogs[0].class_id;
      const normalizedClassId = classId.replace(/_TH$/, '_LT');
      const totalLessonsTaught = teachingLogConfirm.reduce((sum, log) => sum + log.lesson_count, 0);
      
      // Lấy thông tin lớp học từ danh sách calculateMinimumLessons
      const classInfo = lessonData?.min_lessons_breakdown.find(cls => cls.class_id === normalizedClassId);
      if (!classInfo) {
        throw new Error(`Không tìm thấy thông tin lớp học ${classId}`);
      }

      const requiredLessons = classInfo.required_lessons || 0;
      let allowanceIds: string[] = [];
      if (totalLessonsTaught < requiredLessons) {
        return allowanceIds;
      }

      const sessions = teachingLogs.map(log => log.session);
      const confirms = teachingLogs.map(state => state.session_status);
      const teachesMorning = sessions.includes("Sáng(T1-4)");
      const teachesAfternoon = sessions.includes("Chiều(T5-8)");

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
  
    const stateTeach = confirms.every(element => element === "Confirmed");
  
      if (stateTeach) {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          if (teachesMorning && teachesAfternoon) {
            allowanceIds.push("PC004"); // Phụ cấp cả ngày
          } else {
            allowanceIds.push("PC003"); // Phụ cấp 1 buổi
          }
        }
        allowanceIds.push("PC002");
        allowanceIds.push("PC001");
      }
      return allowanceIds;
    } catch (error) {
      throw new Error(`Error determining allowance: ${error.message}`);
    }
  }
  

  findAll() {
    return `This action returns all allowanceDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allowanceDetail`;
  }

  update(id: number, updateAllowanceDetailDto: UpdateAllowanceDetailDto) {
    return `This action updates a #${id} allowanceDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} allowanceDetail`;
  }
}
