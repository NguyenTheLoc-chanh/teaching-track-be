import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayrollsheetService } from './payrollsheet.service';
import { CreatePayrollsheetDto } from './dto/create-payrollsheet.dto';
import { UpdatePayrollsheetDto } from './dto/update-payrollsheet.dto';

@Controller('payrollsheet')
export class PayrollsheetController {
  constructor(private readonly payrollsheetService: PayrollsheetService) {}

  @Post()
  create(@Body() createPayrollsheetDto: CreatePayrollsheetDto) {
    return this.payrollsheetService.create(createPayrollsheetDto);
  }

  @Get()
  findAll() {
    return this.payrollsheetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollsheetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayrollsheetDto: UpdatePayrollsheetDto) {
    return this.payrollsheetService.update(+id, updatePayrollsheetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollsheetService.remove(+id);
  }
}
