import { Module } from '@nestjs/common';
import { AllowanceDetailsService } from './allowance-details.service';
import { AllowanceDetailsController } from './allowance-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AllowanceDetail, AllowanceDetailSchema } from './schemas/allowance-detail.schema';
import { TeachingLog, TeachingLogSchema } from '../teaching_logs/schemas/teaching_log.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema';
import { Lecturer, LecturerSchema } from '../lecturers/schemas/lecturer.schema';

@Module({
  imports: [MongooseModule.forFeature([
        { name: AllowanceDetail.name, schema: AllowanceDetailSchema },
        { name: TeachingLog.name, schema: TeachingLogSchema },
        { name: Classroom.name, schema: ClassroomSchema },
        { name: Subject.name, schema: SubjectSchema },
        { name: Lecturer.name, schema: LecturerSchema },
  ])],
  controllers: [AllowanceDetailsController],
  providers: [AllowanceDetailsService],
  exports: [AllowanceDetailsService],
})
export class AllowanceDetailsModule {}
