import { Lecturer } from "@/modules/lecturers/schemas/lecturer.schema";
import { Subject } from "@/modules/subjects/schemas/subject.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ClassroomDocument = HydratedDocument<Classroom>;


// tbl Lớp học
@Schema({ timestamps: true })
export class Classroom {
    @Prop({ required: true, unique: true })
    class_id: string; // Mã lớp học

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subject.name })
    subject_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Lecturer.name })
    lecturer_id	: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    room: string; // Phòng học
  
    @Prop({ required: true })
    start_time: Date; // Thời gian bắt đầu
  
    @Prop({ required: true })
    end_time: Date; // Thời gian kết thúc
  
    @Prop({ required: true, default: 0 })
    student_count: number; // Số lượng sinh viên
}

export const QuotaSchema = SchemaFactory.createForClass(Classroom);
