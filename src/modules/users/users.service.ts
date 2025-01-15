import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import { Lecturer } from '../lecturers/schemas/lecturer.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Lecturer.name) private lecturerModel: Model<Lecturer>,  
  ) {}
  
  isEmailExist = async(email: string) => {
    const user = await this.userModel.exists({email});
    if(user) return true;
    return false;
  }
  isLecturerID = async (lecturer_id: string) => {
    const lecturer = await this.lecturerModel.findOne({lecturer_id});
    if(lecturer) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, lecturer_id} = createUserDto;
    //Check Email
    const isExist = await this.isEmailExist(email);
    if(isExist){
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng Email khác!`);
    }
    // Kiểm tra đã tồn tại giảng 
    const isLecture = await this.isLecturerID(lecturer_id);
    if(!isLecture){
      throw new BadRequestException(`Giảng viên không tồn tại: ${lecturer_id}. Vui lòng sử dụng mã giảng viên khác khác!`);
    }
    //Has password
    const hashPassword = await hashPasswordHelper(password);

    const user = await this.userModel.create({
      email, password: hashPassword, lecturer_id
    })

    return {
      _id: user._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const {filter, sort} = aqp(query);

    if(filter.current) delete filter.current;
    if(filter.pageSize) delete filter.pageSize;

    if(!current) current = 1;
    if(!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems/ pageSize);
    const skip  = (+current - 1) * (pageSize); 

    const results = await this.userModel
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .select("-password")
    .sort(sort as any);

    return {results, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByLecturerId(lecturer_id: string){
    return await this.userModel.findOne({lecturer_id});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
