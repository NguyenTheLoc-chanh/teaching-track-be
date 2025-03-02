import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Classroom, ClassroomSchema } from './schemas/classroom.schema';
import { Timetable, TimetableSchema } from '../timetables/schemas/timetable.schema';
import { Lecturer, LecturerSchema } from '../lecturers/schemas/lecturer.schema';

@Module({
  imports: [MongooseModule.forFeature([
        { name: Classroom.name, schema: ClassroomSchema },
        { name: Timetable.name, schema: TimetableSchema },
        { name: Lecturer.name, schema: LecturerSchema },
  ])],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
})
export class ClassroomsModule {}
