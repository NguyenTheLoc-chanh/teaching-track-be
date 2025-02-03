import { IsNotEmpty } from "class-validator";

export class CreateCoefficientDetailDto {
    @IsNotEmpty({message: "Mã hệ số không được để trống!"})
    coefficient_id: string; // Mã hệ số (khóa ngoại)
        
    @IsNotEmpty({message: "Mã theo dõi giảng dạy không được để trống!"})
    teaching_log_id: string;
}
