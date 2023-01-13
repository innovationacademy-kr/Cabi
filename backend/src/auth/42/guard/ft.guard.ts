import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtGuard extends AuthGuard('42') {
    handleRequest<TUser = any>(err: any, user: any): TUser {
        if (err || !user) {
          throw (
            err ||
            new UnauthorizedException(
              '🚨 Cabi service is only available in Korea🥲 🚨\nif you need any information, contact us with slack link below\nhttps://42born2code.slack.com/archives/C02V6GE8LD7.',
            )
          );
        }
        return user;
      }
}
