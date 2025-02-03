import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty({message: "Tên đăng nhập không được để trống!"})
    lecturer_id: string;

    @IsNotEmpty({message: "Vui lòng nhập mật khẩu!"})
    password: string;

    @IsOptional()
    name: string;
}
