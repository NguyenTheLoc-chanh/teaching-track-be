import { Injectable } from '@nestjs/common';
import { CreateCoefficientDto } from './dto/create-coefficient.dto';
import { UpdateCoefficientDto } from './dto/update-coefficient.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coefficient } from './schemas/coefficient.schema';

@Injectable()
export class CoefficientsService {
  constructor(
    @InjectModel(Coefficient.name) private coefficientModel: Model<Coefficient>,
  ) {}

  async create(createCoefficientDto: CreateCoefficientDto) {
    const {coefficient_id, coefficient_name, coefficient_value} = createCoefficientDto;

    const coefficient = await this.coefficientModel.create({
      coefficient_id, coefficient_name, coefficient_value
    })
    return {
      _id: coefficient._id
    };
  }

  findAll() {
    return `This action returns all coefficients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coefficient`;
  }

  update(id: number, updateCoefficientDto: UpdateCoefficientDto) {
    return `This action updates a #${id} coefficient`;
  }

  remove(id: number) {
    return `This action removes a #${id} coefficient`;
  }
}
