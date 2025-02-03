import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SubjectDocument = HydratedDocument<Subject>

// tbl Môn học
@Schema({ timestamps: true })
export class Subject {
    @Prop()
    subject_id: string; // Mã môn học
    
    @Prop()
    name: string;

    @Prop()
    nfCredit: number;

}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
