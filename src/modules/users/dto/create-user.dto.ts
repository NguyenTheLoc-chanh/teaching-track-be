import { IsEmail, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateUserDto {

    @IsEmail({}, {message: "Email không đúng định dạng!"})
    email: string; // Email người dùng

    @IsNotEmpty({message: "Mật khẩu không được để trống!"})
    password: string; // Mật khẩu (mã hóa)

    @IsNotEmpty({message: "Mã giảng viên không được để trống!"})
    lecturer_id: string; // Mã giảng viên (tham chiếu bảng Lecturers)
}
