import { IsNotEmpty } from "class-validator";

export class CreateAllowanceDetailDto {
    @IsNotEmpty({message: "Mã phụ cấp không được để trống!"})
    allowance_id: string; // Mã phụ cấp (tham chiếu bảng Allowance)
    
    @IsNotEmpty({message: "Mã bảng theo dõi không được để trống!"})
    teaching_log_id: string; // Mã bảng theo dõi (tham chiếu bảng TeachingLog)
    
    @IsNotEmpty({message: "Số lượng không được để trống!"})
    quantity: number; // Số lượng phụ cấp áp dụng
}
