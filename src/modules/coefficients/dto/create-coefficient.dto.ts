import { IsNotEmpty } from "class-validator";

export class CreateCoefficientDto {
    @IsNotEmpty({message: "Mã hệ số không được để trống!"})
    coefficient_id: string; // Mã hệ số

    @IsNotEmpty({message: "Tên hệ số không được để trống!"})
    coefficient_name: string; // Tên hệ số

    @IsNotEmpty({message: "Giá trị không được để trống!"})
    coefficient_value: number; // Định mức hệ số   
}
