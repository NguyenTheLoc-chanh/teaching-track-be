import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TeachingLogsService } from './teaching_logs.service';
import { CreateTeachingLogDto } from './dto/create-teaching_log.dto';
import { UpdateTeachingLogDto } from './dto/update-teaching_log.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('teaching-logs')
export class TeachingLogsController {
  constructor(private readonly teachingLogsService: TeachingLogsService) {}

  @Post()
  create(@Body() createTeachingLogDto: CreateTeachingLogDto) {
    return this.teachingLogsService.create(createTeachingLogDto);
  }

  // Get all teachinglogs
  // @Get()
  // async findAll(
  //   @Query() query: string,
  //   @Query("current") current: string,
  //   @Query("pageSize") pageSize: string,
  // ) {
  //   return this.teachingLogsService.findAll(query, +current, +pageSize);
  // }

  @Get()
  @Public()
  //@Roles('Lecturer') // Chỉ giảng viên có quyền truy cập
  async findTeachingLogsByLecturerId(
    @Query() query: string,
    @Query("lecturer_id") lecturer_id: string,
  ) {
    return this.teachingLogsService.findTeachingLogsByLecturerId(query,lecturer_id);
  }

  // Lấy ra số tuần
  @Get('weeks')
  async getWeeks() {
      return this.teachingLogsService.getWeeks();
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
