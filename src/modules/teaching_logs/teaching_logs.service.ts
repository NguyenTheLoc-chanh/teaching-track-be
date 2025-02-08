import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeachingLogDto } from './dto/create-teaching_log.dto';
import { UpdateTeachingLogDto } from './dto/update-teaching_log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TeachingLog } from './schemas/teaching_log.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { Classroom } from '../classrooms/schemas/classroom.schema';
import * as dayjs from 'dayjs';


@Injectable()
export class TeachingLogsService {
  constructor(
      @InjectModel(TeachingLog.name) private teachingLogModel: Model<TeachingLog>,
      @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
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
    try {
      const {filter, sort} = aqp(query);

      // Tìm tất cả các lớp học của giảng viên
      const classrooms = await this.classroomModel.find({ lecturer_id });

      if (!classrooms.length) {
        throw new NotFoundException(`No classrooms found for Lecturer ID: ${lecturer_id}`);
      }

      // Lấy danh sách class_id từ classrooms
      const classIds = classrooms.map((classroom) => classroom.class_id);

      // Tìm tất cả các teachingLogs liên quan đến class_id
      const teachingLogs = await this.teachingLogModel
      .find({class_id: { $in: classIds } })
      .sort(sort as any);

      if (!teachingLogs.length) {
        throw new NotFoundException(`No teaching logs found for Lecturer ID: ${lecturer_id}`);
      }

      return teachingLogs;
    } catch (error) {
      throw new Error('Failed to fetch teaching logs');
    }
  }


  // Lấy ra số tuần
  async getWeeks() {
    const startDate = dayjs('2024-01-01', 'YYYY-MM-DD'); // Ngày bắt đầu
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

  findOne(id: number) {
    return `This action returns a #${id} teachingLog`;
  }

  update(id: number, updateTeachingLogDto: UpdateTeachingLogDto) {
    return `This action updates a #${id} teachingLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} teachingLog`;
  }
}
