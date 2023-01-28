import { ApiProperty } from '@nestjs/swagger';

/**
 * 캐비넷의 층별 사용량을 나타내는 DTO입니다.
 */
export class CabinetFloorDto {
  @ApiProperty({
    description: '캐비닛이 위치한 층',
    example: 2,
  })
  floor: number;

  @ApiProperty({
    description: '총 개수',
    example: 42,
  })
  total: number;

  @ApiProperty({
    description: '사용중인 캐비닛의 개수',
    example: 42,
  })
  used: number;

  @ApiProperty({
    description: '만료된 캐비닛의 개수',
    example: 42,
  })
  overdue: number;

  @ApiProperty({
    description: '사용 가능한 캐비닛의 개수',
    example: 42,
  })
  unused: number;

  @ApiProperty({
    description: '비활성화된 캐비닛의 개수',
    example: 42,
  })
  disabled: number;
}
