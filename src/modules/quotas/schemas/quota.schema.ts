import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type QuotaDocument = HydratedDocument<Quota>;

// Bảng định mức thanh toán
@Schema({ timestamps: true })
export class Quota {
    @Prop()
    quota_id: string; // Mã định mức
    @Prop()
    quota_name: string;

    @Prop()
    value: string;
}

export const QuotaSchema = SchemaFactory.createForClass(Quota);
