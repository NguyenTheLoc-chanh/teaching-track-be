import { IsNotEmpty } from "class-validator";

export class CreateClassroomDto {
    @IsNotEmpty({message: "Mã lớp học không được để trống!"})
    class_id: string; // Mã lớp học

    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subject.name })
    @IsNotEmpty({message: "Mã môn học không được để trống!"})
    subject_id: string;

    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Lecturer.name })
    @IsNotEmpty({message: "Mã giảng viên không được để trống!"})
    lecturer_id	: string;

    @IsNotEmpty({message: "Phòng học không được để trống!"})
    room: string; // Phòng học
  
    @IsNotEmpty({message: "Thời gian bắt đầu không được để trống!"})
    start_time: Date; // Thời gian bắt đầu
  
    @IsNotEmpty({message: "Thời gian kết thúc không được để trống!"})
    end_time: Date; // Thời gian kết thúc
  
    @IsNotEmpty({message: "Số lượng sinh viên không được để trống!"})
    student_count: number; // Số lượng sinh viên

    @IsNotEmpty({message: "Mã thời khóa biểu không được để trống!"})
    timetable_id: string; // Mã thời khóa biểu (khóa ngoại)
}
