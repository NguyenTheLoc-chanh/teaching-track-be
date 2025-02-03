import { Module } from '@nestjs/common';
import { AllowanceDetailsService } from './allowance-details.service';
import { AllowanceDetailsController } from './allowance-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AllowanceDetail, AllowanceDetailSchema } from './schemas/allowance-detail.schema';

@Module({
  imports: [MongooseModule.forFeature([
        { name: AllowanceDetail.name, schema: AllowanceDetailSchema },
  ])],
  controllers: [AllowanceDetailsController],
  providers: [AllowanceDetailsService],
})
export class AllowanceDetailsModule {}
