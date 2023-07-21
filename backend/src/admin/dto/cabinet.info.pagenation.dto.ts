import { ApiProperty } from '@nestjs/swagger';
import { CabinetInfoDto } from './cabinet.info.dto';

export class CabinetInfoPagenationDto {
  @ApiProperty({
    description: '캐비넷 정보 배열',
    type: [CabinetInfoDto],
  })
  result: CabinetInfoDto[]; // 캐비넷 정보 배열

  @ApiProperty({
    description: 'DB에 저장된 총 결과의 길이',
    example: 42,
  })
  total_length: number; // DB에 저장된 총 결과의 길이
}
