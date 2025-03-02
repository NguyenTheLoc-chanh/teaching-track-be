import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomsService.create(createClassroomDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTimeTableId(@Query('classId') classId: string) {
    console.log("classId", classId);
    return this.classroomsService.findTimeTableId(classId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getinfodetails')
  async findInfoDetailClass(@Query('classId') classId: string) {
    console.log("classId", classId);
    return this.classroomsService.findInfoDetailClass(classId);
  }

  @Get()
  findAll() {
    return this.classroomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassroomDto: UpdateClassroomDto) {
    return this.classroomsService.update(+id, updateClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classroomsService.remove(+id);
  }
}
