import { Module } from '@nestjs/common';
import { TeachingLogsService } from './teaching_logs.service';
import { TeachingLogsController } from './teaching_logs.controller';

@Module({
  controllers: [TeachingLogsController],
  providers: [TeachingLogsService],
})
export class TeachingLogsModule {}
