
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "@/modules/users/users.service";
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByLecturerId(username);
    if (!user) {
      throw new NotFoundException("Tên đăng nhập không tồn tại!");
    }

    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Mật khẩu không chính xác!");
    }
    return user;
  }

  async login(user: any) {
    const payload = { lecturer_id: user.lecturer.lecturer_id, sub: user._id };
    return {
      user: {
        lecturer_id: user.lecturer.lecturer_id,
        _id: user._id,
        role: user.role,
        lecturer: user.lecturer,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  }

  logout(token: string) {
    this.blacklistedTokens.add(token);
    return { message: "Logout thành công" };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
