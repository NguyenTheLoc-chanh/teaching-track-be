import { Classroom } from "@/modules/classrooms/schemas/classroom.schema";
import { Timetable } from "@/modules/timetables/schemas/timetable.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type TeachingLogDocument = HydratedDocument<TeachingLog>;

// Theo dõi giảng dạy
@Schema({ timestamps: true })
export class TeachingLog {
    @Prop({ default: () => uuidv4() })
    teaching_log_id: string; // Mã bảng theo dõi giảng dạy

    @Prop({ required: true })
    class_id: string; // Mã lớp học (khóa ngoại)

    @Prop({ required: true })
    timetable_id: string; // Mã thời khóa biểu (khóa ngoại)

    @Prop({ required: true })
    session: string; // Ca học 

    @Prop({ required: true })
    date: Date; // Ngày diễn ra buổi học

    @Prop({default: ''})
    content: string; // Nội dung buổi học

    @Prop({ required: true })
    lesson_count: number; // Số tiết giảng dạy

    @Prop({default: 0})
    students_present: number; // Số sinh viên có mặt

    @Prop({ required: true, enum: ['Confirmed', 'Pending', 'Cancelled','Updated'], default: 'Pending' })
    session_status: string; // Trạng thái buổi họ
}

export const TeachingLogSchema = SchemaFactory.createForClass(TeachingLog);
