import { Module } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { TimetablesController } from './timetables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Timetable, TimetableSchema } from './schemas/timetable.schema';
import { TeachingLog, TeachingLogSchema } from '../teaching_logs/schemas/teaching_log.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema';
import { Lecturer, LecturerSchema } from '../lecturers/schemas/lecturer.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: Timetable.name, schema: TimetableSchema },
      { name: TeachingLog.name, schema: TeachingLogSchema },
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Lecturer.name, schema: LecturerSchema },
    ])],
  controllers: [TimetablesController],
  providers: [TimetablesService],
})
export class TimetablesModule {}
