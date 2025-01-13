import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
