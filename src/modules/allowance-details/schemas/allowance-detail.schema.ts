import { Allowance } from "@/modules/allowances/schemas/allowance.schema";
import { TeachingLog } from "@/modules/teaching_logs/schemas/teaching_log.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type AllowanceDetailDocument = HydratedDocument<AllowanceDetail>;

// Chi tiết phụ cấp
@Schema({ timestamps: true })
export class AllowanceDetail {
    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Allowance.name })
    @Prop({ required: true })
    allowance_id: string; // Mã phụ cấp (tham chiếu bảng Allowance)

    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: TeachingLog.name })
    @Prop({ required: true })
    teaching_log_id: string; // Mã bảng theo dõi (tham chiếu bảng TeachingLog)

    @Prop({ required: true, type: Number, min: 0 })
    quantity: number; // Số lượng phụ cấp áp dụng
}

export const AllowanceDetailSchema = SchemaFactory.createForClass(AllowanceDetail);
