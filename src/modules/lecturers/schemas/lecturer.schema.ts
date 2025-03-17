import { Quota } from "@/modules/quotas/schemas/quota.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type LecturerDocument = HydratedDocument<Lecturer>;

// tbl Giảng Viên
@Schema({ timestamps: true })
export class Lecturer {

    @Prop()
    lecturer_id: string; // Mã giảng viên

    @Prop({ required: true })
    quota_id: string;

    @Prop()
    full_name: string;

    @Prop()
    date_of_birth: Date

    @Prop()
    gender: 'Male' | 'Female' | 'Other';

    @Prop()
    title: string;

    @Prop()
    minofper: number;

    @Prop()
    address: string;
}

export const LecturerSchema = SchemaFactory.createForClass(Lecturer);