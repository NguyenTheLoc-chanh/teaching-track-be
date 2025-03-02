import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, Query } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { LocalAuthGuard } from '@/auth/passport/local-auth.guard';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';

@Controller('salaries')
export class SalariesController {
  constructor(private readonly salariesService: SalariesService) {}

  @Post()
  create(@Body() createSalaryDto: CreateSalaryDto) {
    return this.salariesService.create(createSalaryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async updateOrCreateSalary(
    @Request() req,
    @Query("timetable_id") timetable_Id?: string,
  ) {
    const lecturerId = req.user.lecturer_id;
    return this.salariesService.updateOrCreateSalary(lecturerId, timetable_Id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getsalary')
  async getSalaryByLecturerId(
    @Request() req,
    @Query("academic_year") academic_year: string,
  ) {
    const lecturerId = req.user.lecturer_id;
    const cleanAcademicYear = academic_year?.replace(/\?/g, "");
    return this.salariesService.getSalaryByLecturerId(lecturerId, cleanAcademicYear);
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  async getSalaryDetail(@Param('id') id: string) {
      return this.salariesService.getSalaryDetail(id);
  }

  @Get('/details/:classId')
  async getDetailsSalary(@Param('classId') classId: string){
    return this.salariesService.getDetailsSalary(classId);
  }
  
  @Get()
  findAll() {
    return this.salariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salariesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryDto: UpdateSalaryDto) {
    return this.salariesService.update(+id, updateSalaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salariesService.remove(+id);
  }
}
