import { Coefficient } from "@/modules/coefficients/schemas/coefficient.schema";
import { TeachingLog } from "@/modules/teaching_logs/schemas/teaching_log.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CoefficientDetailDocument = HydratedDocument<CoefficientDetail>;

// Chi tiết hệ số + Theo dõi giảng dạy
Schema({ timestamps: true })
export class CoefficientDetail {
    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Coefficient.name })
    @Prop({ required: true })
    coefficient_id: string; // Mã hệ số (khóa ngoại)
    
    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: TeachingLog.name })
    @Prop({ required: true })
    teaching_log_id: string; // Mã bảng theo dõi giảng dạy (khóa ngoại)
}

export const CoefficientDetailSchema = SchemaFactory.createForClass(CoefficientDetail);
