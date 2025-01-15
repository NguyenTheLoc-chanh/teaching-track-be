import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty({message: "Tên đăng nhập không được để trống!"})
    userName: string;

    @IsNotEmpty({message: "Vui lòng nhập mật khẩu!"})
    password: string;
}
