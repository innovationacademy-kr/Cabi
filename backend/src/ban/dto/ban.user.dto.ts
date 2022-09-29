import { UserDto } from 'src/dto/user.dto';

/**
 * 밴 될 유저의 정보를 담는 DTO입니다.
 */
export class BanUserDto extends UserDto {
  cabinet_id: number | null;
}
