import { IsNotEmpty } from "class-validator";

export class CreateSubjectDto {
    @IsNotEmpty({message: "Mã môn học không được để trống!"})
    subject_id: string; // Mã môn học
    
    @IsNotEmpty({message: "Tên môn học không được để trống!"})
    name: string;

    @IsNotEmpty({message: "Số tín chỉ không được để trống!"})
    nfCredit: number;    
}
