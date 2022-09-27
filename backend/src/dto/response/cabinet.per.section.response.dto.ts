import { ApiProperty } from '@nestjs/swagger';
import { CabinetInfoResponseDto } from './cabinet.info.response.dto';

/**
 * 특정 층에 존재하는 사물함 정보
 */
export class CabinetsPerSectionResponseDto {
  @ApiProperty({
    description: '사물함의 섹션 종류 (오아시스 등)',
    example: 'Oasis',
  })
  section: string; // 사물함의 섹션 종류 (오아시스 등)

  @ApiProperty({
    description: '해당 섹션에 존재하는 사물함들',
    type: [CabinetInfoResponseDto],
  })
  cabinets: CabinetInfoResponseDto[]; // 해당 섹션에 존재하는 사물함들
}
