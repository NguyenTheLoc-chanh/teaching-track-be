import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollsheetDto } from './create-payrollsheet.dto';

export class UpdatePayrollsheetDto extends PartialType(CreatePayrollsheetDto) {}
