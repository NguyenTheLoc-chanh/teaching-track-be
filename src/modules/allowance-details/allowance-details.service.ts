import { Injectable } from '@nestjs/common';
import { CreateAllowanceDetailDto } from './dto/create-allowance-detail.dto';
import { UpdateAllowanceDetailDto } from './dto/update-allowance-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AllowanceDetail } from './schemas/allowance-detail.schema';
import { Model } from 'mongoose';

@Injectable()
export class AllowanceDetailsService {
  constructor(
    @InjectModel(AllowanceDetail.name) private allowanceDetailModel: Model<AllowanceDetail> 
  ) {}

  async create(createAllowanceDetailDto: CreateAllowanceDetailDto) {
    const {allowance_id, teaching_log_id, quantity} = createAllowanceDetailDto;

    const allowanceDetail = await this.allowanceDetailModel.create({
      allowance_id, teaching_log_id, quantity
    })
    return {
      _id: allowanceDetail._id
    };
  }

  findAll() {
    return `This action returns all allowanceDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allowanceDetail`;
  }

  update(id: number, updateAllowanceDetailDto: UpdateAllowanceDetailDto) {
    return `This action updates a #${id} allowanceDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} allowanceDetail`;
  }
}
