import { Injectable } from '@nestjs/common';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Timetable } from './schemas/timetable.schema';
import { Model } from 'mongoose';
import { TeachingLog } from '../teaching_logs/schemas/teaching_log.schema';
import { Classroom } from '../classrooms/schemas/classroom.schema';
import { Subject } from '../subjects/schemas/subject.schema';
import { Lecturer } from '../lecturers/schemas/lecturer.schema';

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

    const timetable = await this.timetableModel.create({
        week, semester, academic_year
    })
    return {
      _id: timetable._id
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


  findAll() {
    return `This action returns all timetables`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timetable`;
  }

  update(id: number, updateTimetableDto: UpdateTimetableDto) {
    return `This action updates a #${id} timetable`;
  }

  remove(id: number) {
    return `This action removes a #${id} timetable`;
  }
}
