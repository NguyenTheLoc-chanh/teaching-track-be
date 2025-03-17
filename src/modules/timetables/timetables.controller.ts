import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';

@Controller('timetables')
export class TimetablesController {
  constructor(private readonly timetablesService: TimetablesService) {}

  @Post()
  create(@Body() createTimetableDto: CreateTimetableDto) {
    return this.timetablesService.create(createTimetableDto);
  }

  @Get('academic-years')
  async getAcademicYears() {
    return await this.timetablesService.getAcademicYears();
  }

  @Get('unique-timetable')
  async getUniqueTeachingLogs(@Query("timetable_id") timetable_Id?: string){
    return this.timetablesService.getUniqueTeachingLogs(timetable_Id);
  }

  @Get('semester-calendar')
  async getSemesterCalendar(@Query("academic_year") academic_year?: string) {
    const cleanAcademicYear = academic_year?.replace(/\?/g, "");
    return await this.timetablesService.getSemesterCalendar(cleanAcademicYear);
  }

  @Get()
  findAll() {
    return this.timetablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timetablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimetableDto: UpdateTimetableDto) {
    return this.timetablesService.update(+id, updateTimetableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetablesService.remove(+id);
  }
}
