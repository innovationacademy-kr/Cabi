import { UserDto } from './user.dto';

/**
 * 유저 세션을 저장
 * @extends UserDto
 */
export class UserSessionDto extends UserDto {
  iat?: number; // JWT 발급 시간
  ext?: number; // JWT 만료 시간
  blackholed_at?: Date; // 블랙홀 날짜
  staff?: any; // staff 여부
}
