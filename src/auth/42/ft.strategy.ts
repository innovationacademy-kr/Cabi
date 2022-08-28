import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UserSessionDto } from './user.session.dto';

/**
 * passport-42 Strategy
 * 생성자의 profileFields 필드를 통해 로그인 한 사용자의 profile을 선택적으로 가져올 수 있습니다.
 * value는 가져올 필드의 키 name이며 key는 그 값을 저장할 키 name이 됩니다.
 * 예를 들어 스태프 여부를 나타내는 필드는 42에서 'staff?' 로 제공되며
 * profileFields을 통해 이를 is_staff 라는 이름으로 저장합니다.
 */
@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('ftAuth.clientid'),
      clientSecret: configService.get<string>('ftAuth.secret'),
      callbackURL: configService.get<string>('ftAuth.callbackuri'),
      passReqToCallback: true,
      profileFields: {
        userId: 'id',
        email: 'email',
        login: 'login',
        phone: 'phone',
      },
    });
  }

  /**
   * 42 OAuth 이후 이 정보를 서버 내에서 검증할 때 사용되는 함수이지만
   * 42 로그인이 성공하면 검증이 필요 없으므로 42 데이터를 넘길 때 사용합니다.
   * profile을 전부 콜백함수에 인자로 넘기면 너무 비대하므로 필드를 선택적으로 넘깁니다.
   * cb(null, user); 콜백함수는 res 객체의 user라는 필드로 user의 객체를 넘깁니다.
   */
  async validate(req, accessToken, refreshToken, profile, cb) {
    console.log('validate', accessToken, refreshToken);
    const user: UserSessionDto = {
      user_id: profile.userId,
      email: profile.email,
      intra_id: profile.login,
      phone: profile.phone === 'hidden' ? undefined : profile.phone,
    };
    cb(null, user);
  }
}
