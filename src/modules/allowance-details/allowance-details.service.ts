import { Injectable } from '@nestjs/common';
import { CreateAllowanceDetailDto } from './dto/create-allowance-detail.dto';
import { UpdateAllowanceDetailDto } from './dto/update-allowance-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AllowanceDetail } from './schemas/allowance-detail.schema';
import { Date, Model } from 'mongoose';
import { TeachingLog } from '../teaching_logs/schemas/teaching_log.schema';
import * as dayjs from 'dayjs';
import { Classroom } from '../classrooms/schemas/classroom.schema';

@Injectable()
export class AllowanceDetailsService {
  constructor(
    @InjectModel(AllowanceDetail.name) private allowanceDetailModel: Model<AllowanceDetail>,
    @InjectModel(TeachingLog.name) private teachingLoglModel: Model<TeachingLog>,
    @InjectModel(Classroom.name) private classroomlModel: Model<Classroom>,
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
  // Cập nhật 
  async updateAllowanceDetail(dataAllowances: {allowanceIds: string[], trackingId: string}) {
    const { allowanceIds, trackingId } = dataAllowances;
    if (!allowanceIds || allowanceIds.length === 0) {
      return { message: "No allowance IDs provided" };
    }
    try {
      let results = [];
  
      for (const allowanceId of allowanceIds) {
        let newQuantity = 1; 
        let currentQuantity = 0;

        // Tìm bản ghi hiện tại
        const allowanceDetail = await this.allowanceDetailModel.findOne({
          allowance_id: allowanceId,
          teaching_log_id: trackingId
        }).lean();
        if(allowanceId === "PC001"){
          const teachingLog = await this.teachingLoglModel.findOne({ teaching_log_id: trackingId }).lean();
          if (!teachingLog) {
            console.log(`Không tìm thấy teaching log với ID: ${trackingId}`);
            continue;
          }
          const classroom = await this.classroomlModel.findOne({ class_id: teachingLog.class_id }).lean();
          if (classroom && classroom.student_count) {
            newQuantity = classroom.student_count; 
          } else {
            newQuantity = currentQuantity;
          }
        }else{
           // Lấy quantity hiện tại (nếu chưa có thì mặc định là 0)
          currentQuantity = allowanceDetail ? allowanceDetail.quantity : 0;
          newQuantity = currentQuantity + 1;
        }
        console.log(`Updating ${allowanceId}: ${currentQuantity} -> ${newQuantity}`);
  
        // Cập nhật hoặc tạo mới nếu chưa có
        const updatedAllowanceDetail = await this.allowanceDetailModel.findOneAndUpdate(
          { allowance_id: allowanceId, teaching_log_id: trackingId },
          { $set: { quantity: newQuantity } },
          { new: true, upsert: true }
        );
  
        results.push(updatedAllowanceDetail);
      }
      console.log("Kết quả:", results);
      return results;
    } catch (error) {
      throw new Error(`Error updating allowance detail: ${error.message}`);
    }
  }

  
  async determineAllowance(teachinglog_id: string, date: string) {  
    try {
      const teachingLogs = await this.teachingLoglModel.find({ 
        teaching_log_id: teachinglog_id,
        date: date,
      }).lean();
  
      if (!Array.isArray(teachingLogs) || teachingLogs.length === 0) {
        throw new Error('Teaching log not found');
      }
  
      const sessions = teachingLogs.map(log => log.session);
      const confirms = teachingLogs.map(state => state.session_status);
      const teachesMorning = sessions.includes("Sáng(T1-4)");
      const teachesAfternoon = sessions.includes("Chiều(T5-8)");

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
  
      let allowanceIds: string[] = [];
      const stateTeach = confirms.every(element => element === "Confirmed");
  
      if (stateTeach) {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          if (teachesMorning && teachesAfternoon) {
            allowanceIds.push("PC004"); // Phụ cấp cả ngày
          } else {
            allowanceIds.push("PC003"); // Phụ cấp 1 buổi
          }
        }
        allowanceIds.push("PC002");
        allowanceIds.push("PC001");
      }
  
      return allowanceIds;
    } catch (error) {
      throw new Error(`Error determining allowance: ${error.message}`);
    }
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
