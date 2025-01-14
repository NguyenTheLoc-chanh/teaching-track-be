import { Injectable } from '@nestjs/common';
import { CreateCoefficientDetailDto } from './dto/create-coefficient_detail.dto';
import { UpdateCoefficientDetailDto } from './dto/update-coefficient_detail.dto';

@Injectable()
export class CoefficientDetailsService {
  create(createCoefficientDetailDto: CreateCoefficientDetailDto) {
    return 'This action adds a new coefficientDetail';
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
