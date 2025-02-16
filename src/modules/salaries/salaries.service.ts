import { Injectable } from '@nestjs/common';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Salary } from './schemas/salary.schema';
import { Model } from 'mongoose';

@Injectable()
export class SalariesService {
  constructor(
        @InjectModel(Salary.name) private salaryModel: Model<Salary>,
  ) {}
  
  create(createSalaryDto: CreateSalaryDto) {
    return 'This action adds a new salary';
  }

  findAll() {
    return `This action returns all salaries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salary`;
  }

  update(id: number, updateSalaryDto: UpdateSalaryDto) {
    return `This action updates a #${id} salary`;
  }

  remove(id: number) {
    return `This action removes a #${id} salary`;
  }
}
