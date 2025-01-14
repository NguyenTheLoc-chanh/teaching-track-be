import { Coefficient } from "@/modules/coefficients/schemas/coefficient.schema";
import { TeachingLog } from "@/modules/teaching_logs/schemas/teaching_log.schema";
import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CoefficientDetailDocument = HydratedDocument<CoefficientDetail>;

// Chi tiết hệ số + Theo dõi giảng dạy
Schema({ timestamps: true })
export class CoefficientDetail {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Coefficient.name })
    coefficient_id: string; // Mã hệ số (khóa ngoại)
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: TeachingLog.name })
    teaching_log_id: string; // Mã bảng theo dõi giảng dạy (khóa ngoại)
}
