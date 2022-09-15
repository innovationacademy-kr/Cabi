import { UserDto } from './user.dto';

/**
 * 밴당한 유저의 정보와 사물함 ID를 저장
 * @extends UserDto
 */
export class UserBanDto extends UserDto {
  cabinet_id: number; // 사물함 ID
}
