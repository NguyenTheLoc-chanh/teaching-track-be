import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllowancesService } from './allowances.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';

@Controller('allowances')
export class AllowancesController {
  constructor(private readonly allowancesService: AllowancesService) {}

  @Post()
  create(@Body() createAllowanceDto: CreateAllowanceDto) {
    return this.allowancesService.create(createAllowanceDto);
  }

  @Get()
  findAll() {
    return this.allowancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allowancesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllowanceDto: UpdateAllowanceDto) {
    return this.allowancesService.update(+id, updateAllowanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allowancesService.remove(+id);
  }
}
