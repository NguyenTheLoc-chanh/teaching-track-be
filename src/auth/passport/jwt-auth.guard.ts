import { IS_PUBLIC_KEY } from '@/decorator/customize';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private authService: AuthService;

  constructor(private reflector: Reflector, private moduleRef: ModuleRef) {
    super();
  }
  async onModuleInit() {
    this.authService = this.moduleRef.get(AuthService, { strict: false });
  }
    canActivate(context: ExecutionContext) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        // Kiểm tra nếu token đã bị thu hồi
        if (token && this.authService.isTokenBlacklisted(token)) {
          throw new UnauthorizedException("Token đã bị thu hồi, vui lòng đăng nhập lại!");
        }
        return super.canActivate(context);
    }
    
      handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          throw err || new UnauthorizedException("Access Token không hợp lệ!");
        }
        return user;
      }
}
