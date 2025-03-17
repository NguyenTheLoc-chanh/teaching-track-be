import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { AllowanceDetailsService } from './allowance-details.service';
import { CreateAllowanceDetailDto } from './dto/create-allowance-detail.dto';
import { UpdateAllowanceDetailDto } from './dto/update-allowance-detail.dto';
import { Schema } from 'mongoose';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';

@Controller('allowance-details')
export class AllowanceDetailsController {
  constructor(private readonly allowanceDetailsService: AllowanceDetailsService) {}

  @Post()
  create(@Body() createAllowanceDetailDto: CreateAllowanceDetailDto) {
    return this.allowanceDetailsService.create(createAllowanceDetailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('determine/:trackingId')
  async determineAllowance(
    @Request() req,
    @Param('trackingId') trackingId: string,
    @Query('date') date: string 
  ) {
    console.log("ID:", req.user.lecturer_id);
    console.log("Received date from query:", date);
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format');
    }
    const dateStr = dateObj.toISOString();
    const lecturerId = req.user.lecturer_id;
    return this.allowanceDetailsService.determineAllowance(trackingId, dateStr,lecturerId);
  }

  @Patch('update')
  async updateAllowanceDetail(
    @Body() dataAllowances: { allowanceIds: string[], trackingId: string}
  ) {
    return this.allowanceDetailsService.updateAllowanceDetail(dataAllowances);
  }

  @UseGuards(JwtAuthGuard) // Nếu cần bảo vệ API bằng JWT
  @Get('minimum-lessons/:lecturerId')
  async getMinimumLessons(
    @Request() req,
    @Param('lecturerId') teachingLogId: string
  ) {
    const lecturerId = req.user.lecturer_id;
    return this.allowanceDetailsService.calculateMinimumLessons(teachingLogId,lecturerId);
  }

  @Get()
  findAll() {
    return this.allowanceDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allowanceDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllowanceDetailDto: UpdateAllowanceDetailDto) {
    return this.allowanceDetailsService.update(+id, updateAllowanceDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allowanceDetailsService.remove(+id);
  }
}
