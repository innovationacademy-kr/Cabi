import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CabinetDto } from './cabinet.dto';
import { LentDto } from './lent.dto';

export class CabinetLocationFloorDto extends CabinetDto {
  @ApiProperty({
    description: '사물함의 사물함 건물',
    example: '새롬관',
  })
  location: string; // 사물함 건물

  @ApiProperty({
    description: '사물함의 위치 (층)',
    example: 2,
  })
  floor: number; // 사물함의 위치 (층)

  @ApiPropertyOptional({
    description: '대여되어 있을 경우 대여 정보',
    type: [LentDto],
  })
  lent_info?: LentDto[]; // 대여 정보 (optional)
}
