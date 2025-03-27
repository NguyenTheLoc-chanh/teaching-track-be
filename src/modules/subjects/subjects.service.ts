import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subject } from './schemas/subject.schema';
import { Model } from 'mongoose';
import { Classroom } from '../classrooms/schemas/classroom.schema';
import { Mode } from 'fs';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
    @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
  ) {}
  async create(createSubjectDto: CreateSubjectDto) {
    const {subject_id, name, nfCredit} = createSubjectDto;

    const subject = await this.subjectModel.create({
      subject_id, name, nfCredit
    })
    return {
      _id: subject._id
    };
  }

  async getAllSubjectByClassId (classIds: string[]) : Promise<{ subject_id: string; subject_name: string }[]>{
    const classrooms = await this.classroomModel.find({
      class_id: { $in: classIds },
    }).lean();

    const subjectIds = classrooms.map((cls) => cls.subject_id.trim());

    const subjects = await this.subjectModel.find({
      subject_id: { $in: subjectIds },
    }).lean();
    const subjectMap = new Map(subjects.map((subject) => [subject.subject_id, subject.name]));
    // Trả về danh sách gồm subject_id và subject_name
    return classrooms.map((cls) => ({
      class_id: cls.class_id,
      subject_id: cls.subject_id,
      subject_name: subjectMap.get(cls.subject_id) || "Không tìm thấy",
    }));
  }
  async findAll() {
    const subjects = await this.subjectModel.find().lean();
    return subjects;
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
