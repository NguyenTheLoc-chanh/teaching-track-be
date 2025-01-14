import { Classroom } from "@/modules/classrooms/schemas/classroom.schema";
import { Timetable } from "@/modules/timetables/schemas/timetable.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type TeachingLogDocument = HydratedDocument<TeachingLog>;

// Theo dõi giảng dạy
Schema({ timestamps: true })
export class TeachingLog {
    @Prop({ required: true, unique: true })
    teaching_log_id: string; // Mã bảng theo dõi giảng dạy

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Classroom.name })
    class_id: string; // Mã lớp học (khóa ngoại)

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Timetable.name })
    timetable_id: string; // Mã thời khóa biểu (khóa ngoại)

    @Prop({ required: true })
    session: string; // Ca học 

    @Prop({ required: true })
    date: Date; // Ngày diễn ra buổi học

    @Prop({ required: true })
    content: string; // Nội dung buổi học

    @Prop({ required: true })
    lesson_count: number; // Số tiết giảng dạy

    @Prop({ required: true })
    students_present: number; // Số sinh viên có mặt

    @Prop({ required: true, enum: ['Taught', 'Pending', 'Cancelled'], default: 'Pending' })
    session_status: string; // Trạng thái buổi học
}

export const TeachingLogSchema = SchemaFactory.createForClass(TeachingLog);
