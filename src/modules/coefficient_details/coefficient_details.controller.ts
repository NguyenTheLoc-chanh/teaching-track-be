import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoefficientDetailsService } from './coefficient_details.service';
import { CreateCoefficientDetailDto } from './dto/create-coefficient_detail.dto';
import { UpdateCoefficientDetailDto } from './dto/update-coefficient_detail.dto';

@Controller('coefficient-details')
export class CoefficientDetailsController {
  constructor(private readonly coefficientDetailsService: CoefficientDetailsService) {}

  @Post()
  create(@Body() createCoefficientDetailDto: CreateCoefficientDetailDto) {
    return this.coefficientDetailsService.create(createCoefficientDetailDto);
  }

  @Get()
  findAll() {
    return this.coefficientDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coefficientDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoefficientDetailDto: UpdateCoefficientDetailDto) {
    return this.coefficientDetailsService.update(+id, updateCoefficientDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coefficientDetailsService.remove(+id);
  }
}
