import { Injectable } from '@nestjs/common';
import { CreateAllowanceDetailDto } from './dto/create-allowance-detail.dto';
import { UpdateAllowanceDetailDto } from './dto/update-allowance-detail.dto';

@Injectable()
export class AllowanceDetailsService {
  create(createAllowanceDetailDto: CreateAllowanceDetailDto) {
    return 'This action adds a new allowanceDetail';
  }

  findAll() {
    return `This action returns all allowanceDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allowanceDetail`;
  }

  update(id: number, updateAllowanceDetailDto: UpdateAllowanceDetailDto) {
    return `This action updates a #${id} allowanceDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} allowanceDetail`;
  }
}
