import { Injectable } from '@nestjs/common';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Timetable } from './schemas/timetable.schema';
import { Model } from 'mongoose';

@Injectable()
export class TimetablesService {
  constructor (
      @InjectModel(Timetable.name) private allowanceModel: Model<Timetable>,
  ){}
  async create(createTimetableDto: CreateTimetableDto) {
    const {week, semester, academic_year} = createTimetableDto;

    const timetable = await this.allowanceModel.create({
        week, semester, academic_year
    })
    return {
      _id: timetable._id
    };
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
