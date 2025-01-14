import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeachingLogsService } from './teaching_logs.service';
import { CreateTeachingLogDto } from './dto/create-teaching_log.dto';
import { UpdateTeachingLogDto } from './dto/update-teaching_log.dto';

@Controller('teaching-logs')
export class TeachingLogsController {
  constructor(private readonly teachingLogsService: TeachingLogsService) {}

  @Post()
  create(@Body() createTeachingLogDto: CreateTeachingLogDto) {
    return this.teachingLogsService.create(createTeachingLogDto);
  }

  @Get()
  findAll() {
    return this.teachingLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachingLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeachingLogDto: UpdateTeachingLogDto) {
    return this.teachingLogsService.update(+id, updateTeachingLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingLogsService.remove(+id);
  }
}
