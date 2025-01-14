import { Injectable } from '@nestjs/common';
import { CreatePayrollsheetDto } from './dto/create-payrollsheet.dto';
import { UpdatePayrollsheetDto } from './dto/update-payrollsheet.dto';

@Injectable()
export class PayrollsheetService {
  create(createPayrollsheetDto: CreatePayrollsheetDto) {
    return 'This action adds a new payrollsheet';
  }

  findAll() {
    return `This action returns all payrollsheet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payrollsheet`;
  }

  update(id: number, updatePayrollsheetDto: UpdatePayrollsheetDto) {
    return `This action updates a #${id} payrollsheet`;
  }

  remove(id: number) {
    return `This action removes a #${id} payrollsheet`;
  }
}
