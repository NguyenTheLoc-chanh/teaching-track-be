import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuotasService } from './quotas.service';
import { CreateQuotaDto } from './dto/create-quota.dto';
import { UpdateQuotaDto } from './dto/update-quota.dto';

@Controller('quotas')
export class QuotasController {
  constructor(private readonly quotasService: QuotasService) {}

  @Post()
  create(@Body() createQuotaDto: CreateQuotaDto) {
    return this.quotasService.create(createQuotaDto);
  }

  @Get()
  findAll() {
    return this.quotasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuotaDto: UpdateQuotaDto) {
    return this.quotasService.update(+id, updateQuotaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotasService.remove(+id);
  }
}
