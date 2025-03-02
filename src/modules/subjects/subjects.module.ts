import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: Subject.name, schema: SubjectSchema },
      { name: Classroom.name, schema: ClassroomSchema },
    ])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
