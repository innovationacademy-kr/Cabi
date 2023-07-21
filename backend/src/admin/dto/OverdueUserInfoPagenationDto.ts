import { ApiProperty } from '@nestjs/swagger';
import { OverdueUserCabinetInfoDto } from './Overdue.user.cabinet.info.dto';

export class OverdueUserInfoPagenationDto {
  @ApiProperty({
    description: '차단당한 유저 정보 배열',
    type: [OverdueUserCabinetInfoDto],
  })
  result: OverdueUserCabinetInfoDto[]; // 차단당한 유저 정보 배열

  @ApiProperty({
    description: 'DB에 저장된 총 결과의 길이',
    example: 42,
  })
  total_length: number; // DB에 저장된 총 결과의 길이
}
