import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Timetable } from './schemas/timetable.schema';
import { Model } from 'mongoose';
import { TeachingLog } from '../teaching_logs/schemas/teaching_log.schema';
import { Classroom } from '../classrooms/schemas/classroom.schema';
import { Subject } from '../subjects/schemas/subject.schema';
import { Lecturer } from '../lecturers/schemas/lecturer.schema';
import aqp from 'api-query-params';

@Injectable()
export class TimetablesService {
  constructor (
      @InjectModel(Timetable.name) private timetableModel: Model<Timetable>,
      @InjectModel(TeachingLog.name) private teachingLogModel: Model<TeachingLog>,
      @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
      @InjectModel(Subject.name) private subjectModel: Model<Subject>,
      @InjectModel(Lecturer.name) private lecturerModel: Model<Lecturer>,
  ){}
  async create(createTimetableDto: CreateTimetableDto) {
    const {week, semester, academic_year} = createTimetableDto;
    const existingTimetable = await this.timetableModel.findOne({ semester, academic_year });

    if (existingTimetable) {
      throw new ConflictException({
        statusCode: 409,
        message: "Thời khóa biểu cho năm học và học kỳ này đã tồn tại!",
      });
    }
    
    const timetable = await this.timetableModel.create({
        week, semester, academic_year
    })
    return {
      statusCode: 201,
      message: "Tạo thời khóa biểu thành công!",
      _id: timetable._id,
      week, semester, academic_year
    };
  }
  async getAcademicYears(): Promise<{ label: string; value: string }[]> {
    const academicYears = await this.timetableModel.distinct('academic_year');
    return academicYears.map((year) => ({
      label: year,
      value: year,
    }));
  }

  async getSemesterCalendar(academic_year: string): Promise<{ label: string; value: string }[]> {
    const timetables = await this.timetableModel
        .find({ academic_year }) // Lọc theo năm học
        .select('timetable_id semester') // Chỉ lấy ID và học kỳ
        .lean();

    return timetables.map((timetable) => ({
        label: `Học kỳ ${timetable.semester}`,
        value: timetable.timetable_id.toString(), // Chuyển ObjectId thành string
    }));
  }

  async getUniqueTeachingLogs(timetableId: string) {
    const uniqueLogs = await this.teachingLogModel.aggregate([
        {
            $match: { timetable_id: timetableId } // Lọc theo timetable_id
        },
        {
            $group: {
                _id: "$class_id", // Nhóm theo class_id
                teaching_log: { $first: "$$ROOT" } // Chỉ lấy bản ghi đầu tiên
            }
        },
        {
            $replaceRoot: { newRoot: "$teaching_log" } // Trả về dữ liệu gốc của bản ghi
        }
    ]);

    // Lấy danh sách class_id để tìm classroom
    const classIds = uniqueLogs.map(log => log.class_id);
    const classrooms = await this.classroomModel.find({ class_id: { $in: classIds } }).lean();

    // Lấy danh sách subject_id để tìm tên môn học
    const subjectIds = classrooms.map(cls => cls.subject_id);
    const subjects = await this.subjectModel.find({ subject_id: { $in: subjectIds } }).lean();

    // Lấy ra danh sách giảng viên
    const lecturerIds = classrooms.map(cls => cls.lecturer_id);
    const lecturers = await this.lecturerModel.find({lecturer_id: { $in: lecturerIds}}).lean();

    // Tạo Map để tra cứu nhanh
    const classroomMap = new Map(classrooms.map(cls => [cls.class_id, cls]));
    const subjectMap = new Map(subjects.map(sub => [sub.subject_id, sub.name]));
    const lecturerMap = new Map(lecturers.map(lec => [lec.lecturer_id, lec.full_name]));

    // Cập nhật thông tin room và tên môn học vào kết quả
    return uniqueLogs.map(log => {
      const classroom = classroomMap.get(log.class_id) ?? null; // Trả về null nếu không tìm thấy
      return {
          _id: log._id,
          class_id: log.class_id,
          session: log.session,
          date: log.date,
          room: classroom?.room ?? null,
          subject_name: classroom?.subject_id ? subjectMap.get(classroom.subject_id) ?? null : null,
          lecturer_name: lecturerMap.get(classroom.lecturer_id) ?? null,
      };
  });
}


  async findAll(query: string, current: number, pageSize: number) {
      const {filter, sort} = aqp(query);
  
      if(filter.current) delete filter.current;
      if(filter.pageSize) delete filter.pageSize;
  
      if(!current) current = 1;
      if(!pageSize) pageSize = 10;
  
      const totalItems = (await this.timetableModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems/ pageSize);
      const skip  = (+current - 1) * (pageSize); 
  
      const results = await this.timetableModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      //.select("-password")
      .sort(sort as any);
  
      return {results, totalPages};
    }

  findOne(id: number) {
    return `This action returns a #${id} timetable`;
  }

  update(id: number, updateTimetableDto: UpdateTimetableDto) {
    return `This action updates a #${id} timetable`;
  }

  async remove(id: string) {
    const deletedTimetable = await this.timetableModel.findById(id);
    if (!deletedTimetable) {
      throw new NotFoundException(`Không tìm thấy thời khóa biểu với ID: ${id}`);
    }
    const { timetable_id: timetable_id } = deletedTimetable;
    const classrooms = await this.classroomModel.find({ timetable_id }).lean();
    if(classrooms.length > 0){
      const classIds = classrooms.map(classroom => classroom.class_id); // Lấy danh sách class_id
      await this.teachingLogModel.deleteMany({ class_id: { $in: classIds } });
      await this.classroomModel.deleteMany({ timetable_id });
    }
    await this.timetableModel.findByIdAndDelete(id);
    return { message: "Xóa thành công thời khóa biểu!", deletedTimetable };
  } 
}
