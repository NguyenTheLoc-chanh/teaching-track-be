import { Module } from '@nestjs/common';
import { TeachingLogsService } from './teaching_logs.service';
import { TeachingLogsController } from './teaching_logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema';
import { TeachingLog, TeachingLogSchema } from './schemas/teaching_log.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: TeachingLog.name, schema: TeachingLogSchema },
      { name: Classroom.name, schema: ClassroomSchema},
      { name: Subject.name, schema: SubjectSchema}
  ])],
  controllers: [TeachingLogsController],
  providers: [TeachingLogsService],
})
export class TeachingLogsModule {}
