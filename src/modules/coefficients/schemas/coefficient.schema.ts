import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CoefficientDocument = HydratedDocument<Coefficient>;

// Bảng hệ số
Schema({ timestamps: true })
export class Coefficient {
    @Prop({ required: true, unique: true })
    coefficient_id: string; // Mã hệ số

    @Prop({ required: true })
    coefficient_name: string; // Tên hệ số

    @Prop({ required: true, type: Number })
    coefficient_value: number; // Định mức hệ số
}

export const CoefficientSchema = SchemaFactory.createForClass(Coefficient);