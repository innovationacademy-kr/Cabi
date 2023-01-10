import { ApiProperty } from '@nestjs/swagger';
import { CabinetLentLogDto } from './cabinet-lent-log.dto';

export class LogPagenationDto {
  @ApiProperty({
    description: '로그 배열',
    type: [CabinetLentLogDto],
  })
  result: CabinetLentLogDto[]; // 대여 정보

  @ApiProperty({
    description: 'DB에 저장된 총 결과의 길이',
    example: 42,
  })
  total_length: number; // DB에 저장된 총 결과의 길이
}
