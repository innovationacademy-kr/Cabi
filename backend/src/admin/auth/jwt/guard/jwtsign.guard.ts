import { CookieOptions, Request, Response } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminUserDto } from 'src/admin/dto/admin.user.dto';
import { AdminAuthService } from '../../auth.service';
import AdminUserRole from 'src/admin/enums/admin.user.role.enum';

/**
 * (사전에 인증받았다고 가정한) 사용자 정보를 이용해 JWT 토큰을 발급하여 쿠키에 삽입합니다.
 * passport-jwt와는 독립적인 Guard입니다.
 */
@Injectable()
export class AdminJWTSignGuard implements CanActivate {
  private logger = new Logger(AdminJWTSignGuard.name);

  constructor(
    private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
    private readonly adminAuthService: AdminAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    return await this.generateJWTToken(req, res);
  }

  private async generateJWTToken(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const user = request.user as AdminUserDto | undefined;
    if (user === undefined) {
      this.logger.debug(`can't generate ${user.email}'s admin_access Token`);
      return false;
    }
    await this.adminAuthService.addUserIfNotExists(user);
    const role = await this.adminAuthService.getAdminUserRole(user.email);
    if (role === AdminUserRole.AUTHORIZE_WAITING) {
      this.logger.log(`${user.email} has failed to login due to role.`);
      return false;
    }
    user.role = role;
    const token = this.jwtService.sign(user);
    this.logger.debug(`generated ${user.email}'s token`);
    if (this.configService.get<boolean>('is_local') === true) {
      response.cookie('admin_access_token', token);
    } else {
      const expires = new Date(this.jwtService.decode(token)['exp'] * 1000);
      const cookieOptions: CookieOptions = {
        expires,
        httpOnly: false,
        domain: 'cabi.42seoul.io',
      };
      response.cookie('admin_access_token', token, cookieOptions);
    }
    return true;
  }
}
