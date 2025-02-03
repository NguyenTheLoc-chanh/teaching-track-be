import { IsNotEmpty } from "class-validator";

export class CreateQuotaDto {
    @IsNotEmpty({message: "Mã định mức không được để trống"})
    quota_id: string; // Mã định mức
        
    @IsNotEmpty({message: "Mã định mức không được để trống"})
    quota_name: string;
    
    @IsNotEmpty({message: "Mã định mức không được để trống"})
    value: string;
}
