import { Lecturer } from './../lecturers/schemas/lecturer.schema';
import { Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Classroom } from './schemas/classroom.schema';
import { Model } from 'mongoose';
import { Timetable } from '../timetables/schemas/timetable.schema';
import { Subject } from '../subjects/schemas/subject.schema';

@Injectable()
export class ClassroomsService {
  constructor (
    @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
    @InjectModel(Timetable.name) private timetableModel: Model<Timetable>,
    @InjectModel(Lecturer.name) private lecturerModel: Model<Lecturer>,
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const {class_id, subject_id, lecturer_id, timetable_id, room, start_time, end_time, student_count} = createClassroomDto;

    const classroom = await this.classroomModel.create({
      class_id, subject_id, lecturer_id, room,timetable_id, start_time, end_time, student_count
    })
    return {
      _id: classroom._id,
      class_id,
      subject_id,
      lecturer_id,
      timetable_id,
      room,
      start_time,
    };
  }

  async findTimeTableId(classID: string){
    const ClassRoom = await this.classroomModel.findOne({class_id: classID }).lean();
    if(!ClassRoom.timetable_id) return { message: 'Không tìm mã thời khóa biểu!'}

    return ClassRoom.timetable_id;
  }

  async findInfoDetailClass(classID: string){
    const ClassRoom = await this.classroomModel.findOne({class_id: classID }).lean();
    if(!ClassRoom.lecturer_id) return { message: 'Không tìm mã giảng viên!'}

    const Lecturer = await this.lecturerModel.findOne({lecturer_id: ClassRoom.lecturer_id}).lean();
    if(!Lecturer) return { message: 'Không tìm thấy giảng viên!'}

    const timetable = await this.timetableModel.findOne({timetable_id: ClassRoom.timetable_id }).lean();
    if(!ClassRoom.timetable_id) return { message: 'Không tìm mã thời khóa biểu!'}

    return {
      full_name: Lecturer.full_name,
      academic_year: timetable.academic_year,
      semester: timetable.semester
    }
  }


  async findAll(timetable_id: string) {
    const classrooms = await this.classroomModel.find({ timetable_id: timetable_id }).lean();
    // Lấy danh sách tất cả giảng viên và môn học
    const lecturers = await this.lecturerModel.find().lean();
    const subjects = await this.subjectModel.find().lean();
    const classroomsWithDetails = classrooms.map(classroom => {
      const lecturer = lecturers.find(l => l.lecturer_id.toString() === classroom.lecturer_id);
      const subject = subjects.find(s => s.subject_id.toString() === classroom.subject_id);

      return {
          ...classroom,
          lecturer_name: lecturer ? lecturer.full_name : "Không xác định",
          subject_name: subject ? subject.name : "Không xác định",
      };
    });
    return classroomsWithDetails;
  }

  findOne(id: number) {
    return `This action returns a #${id} classroom`;
  }

  update(id: number, updateClassroomDto: UpdateClassroomDto) {
    return `This action updates a #${id} classroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} classroom`;
  }
}
