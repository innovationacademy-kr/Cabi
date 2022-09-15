import { UserDto } from './user.dto';

/**
 * 기본적인 사물함 대여 정보
 */
export class LentDto {
  lent_id: number; // 대여 고유 ID
  users: UserDto[]; // 해당 사물함을 사용하고 있는 유저들
  lent_time: Date; // 대여한 시간
  expire_time: Date; // 만료 시간
  is_expired: boolean; // 연체 되었는지 아닌지의 여부
}
