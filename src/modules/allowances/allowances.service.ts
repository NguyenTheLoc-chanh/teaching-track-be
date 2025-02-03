import { Injectable } from '@nestjs/common';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Allowance } from './schemas/allowance.schema';
import { Model } from 'mongoose';

@Injectable()
export class AllowancesService {
  constructor (
    @InjectModel(Allowance.name) private allowanceModel: Model<Allowance>,
  ){}
  async create(createAllowanceDto: CreateAllowanceDto) {
    const {allowance_id, allowance_name, allowance_value} = createAllowanceDto;

    const allowance = await this.allowanceModel.create({
      allowance_id, allowance_name, allowance_value
    })
    return {
      _id: allowance._id
    };
  }

  findAll() {
    return `This action returns all allowances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allowance`;
  }

  update(id: number, updateAllowanceDto: UpdateAllowanceDto) {
    return `This action updates a #${id} allowance`;
  }

  remove(id: number) {
    return `This action removes a #${id} allowance`;
  }
}
