import { Module } from '@nestjs/common';
import { AllowanceDetailsService } from './allowance-details.service';
import { AllowanceDetailsController } from './allowance-details.controller';

@Module({
  controllers: [AllowanceDetailsController],
  providers: [AllowanceDetailsService],
})
export class AllowanceDetailsModule {}
