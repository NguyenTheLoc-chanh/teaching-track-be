import { Injectable } from '@nestjs/common';
import { CreateCoefficientDto } from './dto/create-coefficient.dto';
import { UpdateCoefficientDto } from './dto/update-coefficient.dto';

@Injectable()
export class CoefficientsService {
  create(createCoefficientDto: CreateCoefficientDto) {
    return 'This action adds a new coefficient';
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
