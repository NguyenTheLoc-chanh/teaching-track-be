import { Module } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { TimetablesController } from './timetables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Timetable, TimetableSchema } from './schemas/timetable.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: Timetable.name, schema: TimetableSchema },
    ])],
  controllers: [TimetablesController],
  providers: [TimetablesService],
})
export class TimetablesModule {}
