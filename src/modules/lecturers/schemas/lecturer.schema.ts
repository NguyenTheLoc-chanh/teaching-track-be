import { Quota } from "@/modules/quotas/schemas/quota.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type LecturerDocument = HydratedDocument<Lecturer>;

// tbl Giảng Viên
@Schema({ timestamps: true })
export class Lecturer {

    @Prop()
    lecturer_id: string; // Mã giảng viên

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Quota.name })
    quota_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    full_name: string;

    @Prop()
    date_of_birth: Date

    @Prop()
    gender: 'Male' | 'Female' | 'Other';

    @Prop()
    title: string;
}

export const LecturerSchema = SchemaFactory.createForClass(Lecturer);