import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('admin_jwt') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          '🚨 관리자 로그인 정보가 만료되었습니다. 🥲 🚨\n다시 로그인해주세요.',
        )
      );
    }
    return user;
  }
}
