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

    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subject.name })
    @Prop({ required: true })
    subject_id: string;

    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Lecturer.name })
    @Prop({ required: true })
    lecturer_id	: string;

    @Prop({ required: true })
    room: string; // Phòng học
  
    @Prop({ required: true })
    start_time: Date; // Thời gian bắt đầu
  
    @Prop({ required: true })
    end_time: Date; // Thời gian kết thúc
  
    @Prop({ required: true, default: 0 })
    student_count: number; // Số lượng sinh viên

    @Prop({ required: true })
    timetable_id: string; // Mã thời khóa biểu (khóa ngoại)
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
