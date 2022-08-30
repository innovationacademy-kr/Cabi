import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * passport-jwt의 기본 인증을 사용합니다. 현재는 커스텀이 불필요하므로 커스텀하지 않습니다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
