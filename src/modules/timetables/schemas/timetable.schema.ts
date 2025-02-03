import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type TimetableDocument = HydratedDocument<Timetable>;

// Thời khóa biểu
@Schema({ timestamps: true })
export class Timetable {
    @Prop({ default: () => uuidv4() })
    timetable_id: string; // Mã thời khóa biểu

    @Prop({ required: true })
    week: number; // Tuần trong học kỳ

    @Prop({ required: true })
    semester: string; // Học kỳ

    @Prop({ required: true })
    academic_year: string; // Năm học
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);