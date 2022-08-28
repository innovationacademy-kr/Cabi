import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

/**
 * (사전에 인증받았다고 가정한) 사용자 정보를 이용해 JWT 토큰을 발급하여 쿠키에 삽입합니다.
 */
@Injectable()
export class JWTSignGuard implements CanActivate {
  private logger = new Logger(JWTSignGuard.name);

  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const res = context.switchToHttp().getResponse();
    if (user === undefined) {
      return false;
    }
    const token = this.jwtService.sign(user);
    this.logger.debug(`user ${user.intra_id}`);
    res.cookie('accessToken', token, { httpOnly: true, secure: true });
    return true;
  }
  /*
  private validateRequest(request: Request): boolean {
    if (!request.headers.authorization) {
      return false;
    }

    const jwtString = request.headers.authorization.split('Bearer ')[1];

    return this.authService.verify(jwtString);
  }
  */
}
