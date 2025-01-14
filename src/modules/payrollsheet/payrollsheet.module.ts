import { Module } from '@nestjs/common';
import { PayrollsheetService } from './payrollsheet.service';
import { PayrollsheetController } from './payrollsheet.controller';

@Module({
  controllers: [PayrollsheetController],
  providers: [PayrollsheetService],
})
export class PayrollsheetModule {}
