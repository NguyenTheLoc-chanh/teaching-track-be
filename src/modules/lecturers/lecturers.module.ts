import { Module } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecturer, LecturerSchema } from './schemas/lecturer.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lecturer.name, schema: LecturerSchema}])],
  controllers: [LecturersController],
  providers: [LecturersService],
})
export class LecturersModule {}
