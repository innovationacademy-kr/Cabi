import { ApiProperty } from '@nestjs/swagger';
import { UserCabinetInfoDto } from './user.cabinet.info.dto';

/**
 * intraId로 검색했을 때, 해당 유저가 대여중인 사물함 정보와 해당 사물함을 대여한 유저들의 정보를 반환합니다.
 * pagination을 위해 검색 결과의 총 길이도 함께 반환합니다.
 */
export class UserCabinetInfoPagenationDto {
  @ApiProperty({
    description: '유저 & 사물함 정보 배열',
    type: [UserCabinetInfoDto],
  })
  result: UserCabinetInfoDto[];

  @ApiProperty({
    description: 'DB에 저장된 총 결과의 길이',
    example: 42,
  })
  total_length: number;
}
