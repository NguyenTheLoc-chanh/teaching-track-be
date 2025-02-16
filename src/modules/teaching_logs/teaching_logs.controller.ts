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

  @Patch(':id/confirm')
  async confirmTeachingLog(
    @Param('id') _id: string,
    @Body() updateData: {students_present: number, content: string}
  ) {
    return this.teachingLogsService.confirmTeachingLog(_id, updateData);
  }

  @Patch(':id/confirmleave')
  async confirmLeaveNoticeTeachingLog(@Param('id') _id: string)
  {
    console.log("ID:",_id);
    return this.teachingLogsService.confirmLeaveNoticeTeachingLog(_id);
  }

  @Patch(':id/updatesessionold')
  async updateTeachingLogOld(@Param('id') _id: string)
  {
    console.log("ID:",_id);
    return this.teachingLogsService.updateTeachingLogOld(_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingLogsService.remove(+id);
  }
}
