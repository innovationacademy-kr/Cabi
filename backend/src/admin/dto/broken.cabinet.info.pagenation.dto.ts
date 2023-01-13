import { ApiProperty } from '@nestjs/swagger';
import { BrokenCabinetInfoDto } from './broken.cabinet.info.dto';

export class BrokenCabinetInfoPagenationDto {
  @ApiProperty({
    description: '캐비넷 정보 배열',
    type: [BrokenCabinetInfoDto],
  })
  result: BrokenCabinetInfoDto[]; // 캐비넷 정보 배열

  @ApiProperty({
    description: 'DB에 저장된 총 결과의 길이',
    example: 42,
  })
  total_length: number; // DB에 저장된 총 결과의 길이
}
