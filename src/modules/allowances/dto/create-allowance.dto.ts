import { IsNotEmpty } from "class-validator";

export class CreateAllowanceDto {
    @IsNotEmpty({message: "Mã phụ cấp không được để trống!"})
    allowance_id: string; // Mã phụ cấp
    
    @IsNotEmpty({message: "Tên phụ cấp không được để trống!"})
    allowance_name: string; // Tên phụ cấp
    
    @IsNotEmpty({message: "Định mức phụ cấp không được để trống!"})
    allowance_value: number; // Định mức phụ cấp
}
