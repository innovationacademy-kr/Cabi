import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

// 쿠키에서 추출하는 방식에서 다른 방식으로 변경하면 ExtractJwt에 정의된 메소드 사용하기
const extracter = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

/**
 * passport-jwt Strategy
 * 생성자에서 JWT 토큰을 추출할 함수와 시크릿 키를 설정합니다.
 * 필요한 경우 validate 메소드 내에 검증 로직을 삽입합니다.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: extracter,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    const exist = await this.authService.checkUserExists(payload.user_id);
    if (!exist) {
      return false;
    }
    // 검증이 필요없다 판단함
    return payload;
  }
}
