import { Module } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { SalariesController } from './salaries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Salary, SalarySchema } from './schemas/salary.schema';
import { TeachingLog, TeachingLogSchema } from '../teaching_logs/schemas/teaching_log.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';
import { AllowanceDetail, AllowanceDetailSchema } from '../allowance-details/schemas/allowance-detail.schema';
import { Quota, QuotaSchema } from '../quotas/schemas/quota.schema';
import { Lecturer, LecturerSchema } from '../lecturers/schemas/lecturer.schema';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema';
import { Timetable, TimetableSchema } from '../timetables/schemas/timetable.schema';
import { Allowance, AllowanceSchema } from '../allowances/schemas/allowance.schema';

@Module({
  imports: [MongooseModule.forFeature([
        { name: Salary.name, schema: SalarySchema },
        { name: TeachingLog.name, schema: TeachingLogSchema},
        { name: Classroom.name, schema: ClassroomSchema},
        { name: Quota.name, schema: QuotaSchema},
        { name: Lecturer.name, schema: LecturerSchema},
        { name: AllowanceDetail.name, schema: AllowanceDetailSchema},
        { name: Subject.name, schema: SubjectSchema},
        { name: Timetable.name, schema: TimetableSchema},
        { name: Allowance.name, schema: AllowanceSchema},
  ])],
  controllers: [SalariesController],
  providers: [SalariesService],
})
export class SalariesModule {}
