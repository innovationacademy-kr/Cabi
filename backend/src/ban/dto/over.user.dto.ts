import { UserDto } from "src/user/dto/user.dto";

/**
 * 연체자 정보를 담은 DTO 입니다.
 */
export class OverUserDto extends UserDto {
  auth: number;
  email: string;
  lent_id: number;
  cabinet_id: number;
}