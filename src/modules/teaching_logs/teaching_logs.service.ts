import { Injectable } from '@nestjs/common';
import { CreateTeachingLogDto } from './dto/create-teaching_log.dto';
import { UpdateTeachingLogDto } from './dto/update-teaching_log.dto';

@Injectable()
export class TeachingLogsService {
  create(createTeachingLogDto: CreateTeachingLogDto) {
    return 'This action adds a new teachingLog';
  }

  findAll() {
    return `This action returns all teachingLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teachingLog`;
  }

  update(id: number, updateTeachingLogDto: UpdateTeachingLogDto) {
    return `This action updates a #${id} teachingLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} teachingLog`;
  }
}
