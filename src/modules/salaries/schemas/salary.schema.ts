import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SalaryDocument = HydratedDocument<Salary>;

@Schema({ timestamps: true })
export class Salary {
    @Prop({ required: true })
    lecturer_id: string;
  
    @Prop({ required: true })
    semester: string; // Học kỳ
  
    @Prop({ required: true })
    academic_year: string; // Năm học
  
    @Prop({ required: true })
    total_salary: number;
  
    @Prop({ type: Array })
    breakdown: any[]; // Lưu chi tiết từng lớp
  
    @Prop({ default: false }) 
    is_paid: boolean; // Trạng thái đã thanh toán hay chưa
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
