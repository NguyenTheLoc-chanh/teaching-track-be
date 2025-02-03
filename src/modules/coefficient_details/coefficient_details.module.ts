import { Module } from '@nestjs/common';
import { CoefficientDetailsService } from './coefficient_details.service';
import { CoefficientDetailsController } from './coefficient_details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoefficientDetail, CoefficientDetailSchema } from './schemas/coefficient_detail.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: CoefficientDetail.name, schema: CoefficientDetailSchema },
  ])],  
  controllers: [CoefficientDetailsController],
  providers: [CoefficientDetailsService],
})
export class CoefficientDetailsModule {}
