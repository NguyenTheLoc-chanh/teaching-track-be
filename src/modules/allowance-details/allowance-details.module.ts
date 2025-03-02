import { Module } from '@nestjs/common';
import { AllowanceDetailsService } from './allowance-details.service';
import { AllowanceDetailsController } from './allowance-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AllowanceDetail, AllowanceDetailSchema } from './schemas/allowance-detail.schema';
import { TeachingLog, TeachingLogSchema } from '../teaching_logs/schemas/teaching_log.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';

@Module({
  imports: [MongooseModule.forFeature([
        { name: AllowanceDetail.name, schema: AllowanceDetailSchema },
        { name: TeachingLog.name, schema: TeachingLogSchema },
        { name: Classroom.name, schema: ClassroomSchema },
  ])],
  controllers: [AllowanceDetailsController],
  providers: [AllowanceDetailsService],
})
export class AllowanceDetailsModule {}
