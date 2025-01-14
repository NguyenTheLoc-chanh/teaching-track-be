import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllowanceDetailsService } from './allowance-details.service';
import { CreateAllowanceDetailDto } from './dto/create-allowance-detail.dto';
import { UpdateAllowanceDetailDto } from './dto/update-allowance-detail.dto';

@Controller('allowance-details')
export class AllowanceDetailsController {
  constructor(private readonly allowanceDetailsService: AllowanceDetailsService) {}

  @Post()
  create(@Body() createAllowanceDetailDto: CreateAllowanceDetailDto) {
    return this.allowanceDetailsService.create(createAllowanceDetailDto);
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
