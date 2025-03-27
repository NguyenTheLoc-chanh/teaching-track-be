import { IsNotEmpty, IsDateString, IsInt, Min } from "class-validator";

export class CreateTeachingLogDto {
    @IsNotEmpty({ message: "Mã theo dõi không được để trống!" })
    teaching_log_id: string; 
    
    @IsNotEmpty({ message: "Mã lớp học không được để trống!" })
    class_id: string; // Mã lớp học (khóa ngoại)

    @IsNotEmpty({ message: "Ca học không được để trống!" })
    session: string; // Ca học 

    @IsNotEmpty({ message: "Ngày diễn ra buổi học không được để trống!" })
    @IsDateString({}, { message: "Ngày diễn ra phải là ngày hợp lệ!" })
    date: Date; // Ngày diễn ra buổi học
    
    @IsNotEmpty({ message: "Số tín chỉ không được để trống!" })
    credit: number;
}
