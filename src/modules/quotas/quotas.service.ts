import { Injectable } from '@nestjs/common';
import { CreateQuotaDto } from './dto/create-quota.dto';
import { UpdateQuotaDto } from './dto/update-quota.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Quota } from './schemas/quota.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuotasService {
  constructor(
      @InjectModel(Quota.name) private quotaModel: Model<Quota>,
  ) {}

  async create(createQuotaDto: CreateQuotaDto) {
    const {quota_id, quota_name, value} = createQuotaDto;

    const quota = await this.quotaModel.create({
      quota_id, quota_name, value
    })
    return {
      _id: quota._id
    };
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
