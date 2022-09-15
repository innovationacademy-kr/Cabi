import { UserBanDto } from './user.ban.dto';

/**
 * 연체된 사용자와 렌트 ID, 상태를 저장
 * @extends UserBanDto
 */
export class UserOverDto extends UserBanDto {
  auth: number; // 연체자 상태 (일반, 차단, 블랙홀)
  lent_id: number; // 렌트 고유 ID
}
