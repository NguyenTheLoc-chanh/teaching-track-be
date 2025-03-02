import { IsNotEmpty, IsDateString } from "class-validator";

export class CreateTeachingLogDto {
    @IsNotEmpty({ message: "Mã bảng theo dõi giảng dạy không được để trống!" })
    teaching_log_id: string;

    @IsNotEmpty({ message: "Mã lớp học không được để trống!" })
    class_id: string; // Mã lớp học (khóa ngoại)

    @IsNotEmpty({ message: "Ca học không được để trống!" })
    session: string; // Ca học 

    @IsNotEmpty({ message: "Ngày diễn ra buổi học không được để trống!" })
    @IsDateString({}, { message: "Ngày diễn ra phải là ngày hợp lệ (ISO 8601)!" })
    date: Date; // Ngày diễn ra buổi học

    @IsNotEmpty({ message: "Số tiết giảng dạy không được để trống!" })
    //@IsInt({ message: "Số tiết giảng dạy phải là số nguyên!" })
    //@IsPositive({ message: "Số tiết giảng dạy phải lớn hơn 0!" })
    lesson_count: number; // Số tiết giảng dạy
}
