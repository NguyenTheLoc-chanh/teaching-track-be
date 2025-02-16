import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeachingLogDto } from './dto/create-teaching_log.dto';
import { UpdateTeachingLogDto } from './dto/update-teaching_log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TeachingLog } from './schemas/teaching_log.schema';
import { Model, Types, ObjectId } from 'mongoose';
import aqp from 'api-query-params';
import { Classroom } from '../classrooms/schemas/classroom.schema';
import * as dayjs from 'dayjs';
import { Subject } from '../subjects/schemas/subject.schema';


@Injectable()
export class TeachingLogsService {
  constructor(
      @InjectModel(TeachingLog.name) private teachingLogModel: Model<TeachingLog>,
      @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
      @InjectModel(Subject.name) private subjectModel: Model<Subject>,
  ) {}

  async create(createTeachingLogDto: CreateTeachingLogDto) {
    const {class_id, timetable_id, session, date,lesson_count} = createTeachingLogDto;

    const teachingLog = await this.teachingLogModel.create({
      class_id, timetable_id, session, date,lesson_count
    })
    return {
      _id: teachingLog._id
    };
  }

  // Get all Teachinglog
  async findAll(query: string, current: number, pageSize: number) {
    const {filter, sort} = aqp(query);

    if(filter.current) delete filter.current;
    if(filter.pageSize) delete filter.pageSize;

    if(!current) current = 1;
    if(!pageSize) pageSize = 10;

    const totalItems = (await this.teachingLogModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems/ pageSize);
    const skip  = (+current - 1) * (pageSize); 

    const results = await this.teachingLogModel
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .sort(sort as any);

    return {results, totalPages};
  }

  // Tìm các bản ghi teachingLog liên quan đến giảng viên
  async findTeachingLogsByLecturerId(query: string, lecturer_id: string) {
    lecturer_id = lecturer_id.replace('?', '');
    try {
      const {filter, sort} = aqp(query);

      // Tìm tất cả các lớp học của giảng viên
      const classrooms = await this.classroomModel
      .find({ lecturer_id });

      if (!classrooms.length) {
        throw new NotFoundException(`No classrooms found for Lecturer ID: ${lecturer_id}`);
      }

      // Lấy danh sách class_id từ classrooms
      const classInfo = classrooms.map((classroom) => ({
        class_id: classroom.class_id,
        subject_id: classroom.subject_id, // Lấy subject_id từ bảng Classroom
        room: classroom.room,
      }));

    // Tìm tất cả các teachingLogs liên quan đến class_id
    let teachingLogs = await this.teachingLogModel
      .find({ class_id: { $in: classInfo.map(classroom => classroom.class_id) } })
      .lean()
      .sort(sort as any);

    if (!teachingLogs.length) {
      throw new NotFoundException(`No teaching logs found for Lecturer ID: ${lecturer_id}`);
    }

    // Lặp qua từng teachingLog và lấy tên môn học từ bảng Subject dựa trên subject_id
    teachingLogs = await Promise.all(teachingLogs.map(async (teachingLog) => {
      const classroom = classInfo.find(classroom => classroom.class_id === teachingLog.class_id);

      if (classroom?.subject_id) {
        // Truy vấn bảng Subject để lấy tên môn học
        const subject = await this.subjectModel.findOne({ subject_id: classroom.subject_id }).select('name');
        
        return {
          ...teachingLog, // Chuyển Mongoose Document thành object thông thường
          subject: subject ? { 
            subjectId: subject.subject_id, // Lấy subjectId từ subject_id trong subject
            name: subject.name, // Lấy tên môn từ bảng Subject
          } : null, // Nếu không có subject thì trả về null
          room: classroom.room,
        };
      }

      return {
        ...teachingLog, 
        subject: null, // Nếu không có subject_id trong classroom thì gán null
        room: classroom?.room || null,
      };
    }));

    return teachingLogs;

    } catch (error) {
      console.error('Error while fetching teaching logs:', error);
      throw error;
    }
  }


  // Lấy ra số tuần
  async getWeeks() {
    const startDate = dayjs('2024-12-23', 'YYYY-MM-DD'); // Ngày bắt đầu
    const numberOfWeeks = 20;
    let weeks = [];

    for (let i = 0; i < numberOfWeeks; i++) {
        const startOfWeek = startDate.add(i * 7, 'day');
        const endOfWeek = startOfWeek.add(6, 'day');

        weeks.push({
            label: `Tuần ${i + 1} (${startOfWeek.format('MM/DD/YYYY')} - ${endOfWeek.format('MM/DD/YYYY')})`,
            value: i + 1,
        });
    }

    return weeks;
  }

  async confirmTeachingLog(
    _id: string,
    updateData: {students_present: number, content: string}): Promise<{ message: string }> {
    
    const teachingLog = await this.teachingLogModel.findById({_id});

    if (!teachingLog) throw new NotFoundException("Teaching Log not found");

    teachingLog.session_status = "Confirmed";
    if (updateData.students_present !== undefined) {
      teachingLog.students_present = updateData.students_present;
    }
    if (updateData.content !== undefined) {
      teachingLog.content = updateData.content;
    }

    await teachingLog.save();

    return { message: "Buổi học đã được xác nhận!" };
  }

  // Xác nhận báo nghỉ
  async confirmLeaveNoticeTeachingLog(_id: string): Promise<{ message: string }> {
    
    const teachingLog = await this.teachingLogModel.findById({_id});

    if (!teachingLog) throw new NotFoundException("Teaching Log not found");

    teachingLog.session_status = "Cancelled";

    await teachingLog.save();

    return { message: "Buổi học đã được xác nhận nghỉ!" };
  }

  async updateTeachingLogOld(_id: string): Promise<{ message: string }> {
    
    const teachingLog = await this.teachingLogModel.findById({_id});

    if (!teachingLog) throw new NotFoundException("Teaching Log not found");

    teachingLog.session_status = "Updated";

    await teachingLog.save();

    return { message: "Đã cập nhật lịch học mới thành công!" };
  }

  remove(id: number) {
    return `This action removes a #${id} teachingLog`;
  }
}
