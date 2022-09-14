import { IsNotEmpty, IsNumber } from "class-validator";
import { UserDto } from "src/user/dto/user.dto";

/**
 * 밴 될 유저의 정보를 담는 DTO입니다.
 */
export class BanUserDto extends UserDto{

  @IsNumber()
  @IsNotEmpty()
  cabinet_id: number;
}
