import { Module } from '@nestjs/common';
import { CoefficientDetailsService } from './coefficient_details.service';
import { CoefficientDetailsController } from './coefficient_details.controller';

@Module({
  controllers: [CoefficientDetailsController],
  providers: [CoefficientDetailsService],
})
export class CoefficientDetailsModule {}
