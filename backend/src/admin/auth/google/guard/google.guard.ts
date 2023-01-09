import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  // constructor(private configService: ConfigService) {
  //   super({
  //     accessType: 'offline',
  //   });
  // }
  // accessType: 'offline'은 구글 인증을 통한 refreshToken(accessToken보다 만료기간이 훨씬 긴 것)을 발급해주는데,
  // 현재로서는 어드민 인증에 불필요하므로 추후 추가 가능성을 염두해 가드의 껍데기만 남겨놓기로 결정했습니다.
}
