import { Injectable } from '@nestjs/common';
import { CreateCoefficientDetailDto } from './dto/create-coefficient_detail.dto';
import { UpdateCoefficientDetailDto } from './dto/update-coefficient_detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CoefficientDetail } from './schemas/coefficient_detail.schema';
import { Model } from 'mongoose';

@Injectable()
export class CoefficientDetailsService {
  constructor(
    @InjectModel(CoefficientDetail.name) private coefficientDetailModel: Model<CoefficientDetail>,
  ) {}
  async create(createCoefficientDetailDto: CreateCoefficientDetailDto) {
    const {coefficient_id, teaching_log_id} = createCoefficientDetailDto;

    const coefficientDetail = await this.coefficientDetailModel.create({
      coefficient_id, teaching_log_id
    })
    return {
      _id: coefficientDetail._id
    };
  }

  findAll() {
    return `This action returns all coefficientDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coefficientDetail`;
  }

  update(id: number, updateCoefficientDetailDto: UpdateCoefficientDetailDto) {
    return `This action updates a #${id} coefficientDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} coefficientDetail`;
  }
}
