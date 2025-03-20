import { PartialType } from '@nestjs/mapped-types';
import { CreateLecturerDto } from './create-lecturer.dto';
import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLecturerDto {
    @IsNotEmpty({message: "Mã giảng viên không được để trống!"})
    lecturer_id: string;

    @IsOptional()
    @IsString({ message: "Họ và tên phải là chuỗi ký tự!" })
    full_name: string;

    @IsOptional()
    @IsDateString({}, { message: "Ngày sinh phải có định dạng yyyy-mm-dd!" })
    date_of_birth: Date

    @IsOptional()
    gender: 'Male' | 'Female' | 'Other';

    @IsOptional()
    @IsString({ message: "Địa chỉ phải là chuỗi ký tự!" })
    address?: string;
}
