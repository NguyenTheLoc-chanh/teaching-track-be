import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTimetableDto {
    @IsNotEmpty({message: "Tuần không được để trống!"})
    week: number; // Tuần trong học kỳ

    @IsNotEmpty({message: "Học kỳ không được để trống!"})
    semester: string; // Học kỳ

    @IsNotEmpty({message: "Năm học không được để trống!"})
    academic_year: string; // Năm học
}
