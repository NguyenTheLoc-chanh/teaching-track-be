import { Module } from '@nestjs/common';
import { PayrollsheetService } from './payrollsheet.service';
import { PayrollsheetController } from './payrollsheet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payrollsheet, PayrollsheetSchema } from './schemas/payrollsheet.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: Payrollsheet.name, schema: PayrollsheetSchema },
  ])],
  controllers: [PayrollsheetController],
  providers: [PayrollsheetService],
})
export class PayrollsheetModule {}
