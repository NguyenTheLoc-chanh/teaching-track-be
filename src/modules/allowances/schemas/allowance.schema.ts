import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AllowanceDocument = HydratedDocument<Allowance>;

// Bảng phụ cấp
@Schema({ timestamps: true })
export class Allowance {
    @Prop({ required: true, unique: true })
    allowance_id: string; // Mã phụ cấp

    @Prop({ required: true })
    allowance_name: string; // Tên phụ cấp

    @Prop({ required: true, type: Number })
    allowance_value: number; // Định mức phụ cấp
}

export const AllowanceSchema = SchemaFactory.createForClass(Allowance);
