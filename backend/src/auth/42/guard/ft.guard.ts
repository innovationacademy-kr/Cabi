import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * passport-42의 기본 인증을 사용합니다. 현재는 커스텀이 불필요하므로 커스텀하지 않습니다.
 */
@Injectable()
export class FtGuard extends AuthGuard('42') {
    handleRequest<TUser = any>(err: any, user: any): TUser {
        if (err || !user) {
          throw (
            err ||
            new UnauthorizedException(
              'Sorry 🥲 Cabi only services in korea.\nfeel free to contact us in slack : #42seoul_club_cabinet',
            )
          );
        }
        return user;
      }
}
