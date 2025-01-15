import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Lecturer } from './schemas/lecturer.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class LecturersService {
  constructor(
      @InjectModel(Lecturer.name) private lecturerModel: Model<Lecturer>,  
    ) {}
  create(createLecturerDto: CreateLecturerDto) {
    return 'This action adds a new lecturer';
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort} = aqp(query);
    if(filter.current) delete filter.current;
    if(filter.pageSize) delete filter.pageSize;

    if(!current) current = 1;
    if(!pageSize) pageSize = 10;

    const totalItems = (await this.lecturerModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (pageSize);

    const results = await this.lecturerModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)

      return {results, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} lecturer`;
  }

  async update(updateLecturerDto: UpdateLecturerDto) {
    return await this.lecturerModel.updateOne(
      {_id: updateLecturerDto._id}, 
      {...updateLecturerDto}
    );
  }

  async remove(_id: string) {
    // Check id
    if(mongoose.isValidObjectId(_id)){
      // Delete
      return await this.lecturerModel.deleteOne({ _id })
    }else{
      throw new BadRequestException("Id không đúng định dạng");
    }
  }
}
