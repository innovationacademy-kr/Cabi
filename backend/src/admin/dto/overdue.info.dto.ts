import { ApiProperty } from '@nestjs/swagger';

export class OverdueInfoDto {
  @ApiProperty({
    description: '42 고유 ID',
    example: 12345,
  })
  intra_id: string;

  @ApiProperty({
    description: '캐비닛이 위치한 층',
    example: 12345,
  })
  floor: number;

  @ApiProperty({
    description: '캐비닛 번호',
    example: 12345,
  })
  cabinet_num: number;

  @ApiProperty({
    description: '대여한 시각',
    example: new Date(),
  })
  lent_time: Date;

  @ApiProperty({
    description: '만료 시각',
    example: new Date(),
  })
  expire_time: Date;
}
