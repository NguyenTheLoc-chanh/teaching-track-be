import { PartialType } from '@nestjs/mapped-types';
import { CreateLecturerDto } from './create-lecturer.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLecturerDto {
    @IsMongoId({message: "_id không hợp lệ!"})
    @IsNotEmpty({message: "_id không được để trống!"})
    _id: string;

    @IsOptional()
    full_name: string;

    @IsOptional()
    date_of_birth: Date

    @IsOptional()
    gender: 'Male' | 'Female' | 'Other';
}
