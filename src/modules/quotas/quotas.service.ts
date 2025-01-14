import { Injectable } from '@nestjs/common';
import { CreateQuotaDto } from './dto/create-quota.dto';
import { UpdateQuotaDto } from './dto/update-quota.dto';

@Injectable()
export class QuotasService {
  create(createQuotaDto: CreateQuotaDto) {
    return 'This action adds a new quota';
  }

  findAll() {
    return `This action returns all quotas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quota`;
  }

  update(id: number, updateQuotaDto: UpdateQuotaDto) {
    return `This action updates a #${id} quota`;
  }

  remove(id: number) {
    return `This action removes a #${id} quota`;
  }
}
