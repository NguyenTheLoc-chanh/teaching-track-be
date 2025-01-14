import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoefficientsService } from './coefficients.service';
import { CreateCoefficientDto } from './dto/create-coefficient.dto';
import { UpdateCoefficientDto } from './dto/update-coefficient.dto';

@Controller('coefficients')
export class CoefficientsController {
  constructor(private readonly coefficientsService: CoefficientsService) {}

  @Post()
  create(@Body() createCoefficientDto: CreateCoefficientDto) {
    return this.coefficientsService.create(createCoefficientDto);
  }

  @Get()
  findAll() {
    return this.coefficientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coefficientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoefficientDto: UpdateCoefficientDto) {
    return this.coefficientsService.update(+id, updateCoefficientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coefficientsService.remove(+id);
  }
}
