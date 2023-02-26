import { ApiProperty } from '@nestjs/swagger';
import { BlockedUserCabinetInfoDto } from './blocked.user.cabinet.info.dto';
import { BlockedUserInfoDto } from './blocked.user.info.dto';

export class BlockedUserInfoPagenationDto {
  @ApiProperty({
    description: '차단당한 유저 정보 배열',
    type: [BlockedUserCabinetInfoDto],
  })
  result: BlockedUserCabinetInfoDto[]; // 차단당한 유저 정보 배열

  @ApiProperty({
    description: 'DB에 저장된 총 결과의 길이',
    example: 42,
  })
  total_length: number; // DB에 저장된 총 결과의 길이
}
