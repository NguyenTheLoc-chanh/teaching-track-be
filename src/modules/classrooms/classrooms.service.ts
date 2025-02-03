import { Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Classroom } from './schemas/classroom.schema';
import { Model } from 'mongoose';

@Injectable()
export class ClassroomsService {
  constructor (
    @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const {class_id, subject_id, lecturer_id, room, start_time, end_time, student_count} = createClassroomDto;

    const classroom = await this.classroomModel.create({
      class_id, subject_id, lecturer_id, room, start_time, end_time, student_count
    })
    return {
      _id: classroom._id
    };
  }

  findAll() {
    return `This action returns all classrooms`;
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
