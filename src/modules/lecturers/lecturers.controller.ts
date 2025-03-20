import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';

@Controller('lecturers')
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Post()
  create(@Body() createLecturerDto: CreateLecturerDto) {
    return this.lecturersService.create(createLecturerDto);
  }

  @Get()
  async findAll(
    @Query() query: string,
    @Query() current: string,
    @Query() pageSize: string,
  ) {
    return this.lecturersService.findAll(query, +current, +pageSize);
  }

  @UseGuards(JwtAuthGuard)
  @Get('infolecturer')
  async getLecturer(
    @Request() req
  ){
    const lecturerId = req.user.lecturer_id;
    return this.lecturersService.getLecturer(lecturerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturersService.findOne(+id);
  }

  @Patch()
  async update(@Body() updateLecturerDto: UpdateLecturerDto) {
      const updatedLecturer = await this.lecturersService.update(updateLecturerDto);
      
      if (!updatedLecturer) {
          throw new NotFoundException("Giảng viên không tồn tại hoặc không thể cập nhật");
      }
      
      return {
          statusCode: 200,
          message: "Cập nhật thành công",
          data: updatedLecturer
      };
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturersService.remove(id);
  }
}
