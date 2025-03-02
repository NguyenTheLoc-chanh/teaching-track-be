import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AllowanceDetailsService } from './allowance-details.service';
import { CreateAllowanceDetailDto } from './dto/create-allowance-detail.dto';
import { UpdateAllowanceDetailDto } from './dto/update-allowance-detail.dto';
import { Schema } from 'mongoose';

@Controller('allowance-details')
export class AllowanceDetailsController {
  constructor(private readonly allowanceDetailsService: AllowanceDetailsService) {}

  @Post()
  create(@Body() createAllowanceDetailDto: CreateAllowanceDetailDto) {
    return this.allowanceDetailsService.create(createAllowanceDetailDto);
  }

  @Get('determine/:trackingId')
  async determineAllowance(
    @Param('trackingId') trackingId: string,
    @Query('date') date: string 
  ) {
    console.log("Received date from query:", date);
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format');
    }
    const dateStr = dateObj.toISOString();
    return this.allowanceDetailsService.determineAllowance(trackingId, dateStr);
  }

  @Patch('update')
  async updateAllowanceDetail(
    @Body() dataAllowances: { allowanceIds: string[], trackingId: string}
  ) {
    return this.allowanceDetailsService.updateAllowanceDetail(dataAllowances);
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
