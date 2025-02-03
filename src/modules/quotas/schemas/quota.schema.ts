import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type QuotaDocument = HydratedDocument<Quota>;

// Bảng định mức thanh toán
@Schema({ timestamps: true })
export class Quota {
    @Prop({ required: true })
    quota_id: string; // Mã định mức
    
    @Prop({ required: true })
    quota_name: string;

    @Prop({ required: true })
    value: string;
}

export const QuotaSchema = SchemaFactory.createForClass(Quota);
