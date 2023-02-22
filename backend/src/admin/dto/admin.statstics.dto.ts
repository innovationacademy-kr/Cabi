import { ApiProperty } from '@nestjs/swagger';

export class AdminStatisticsDto {
  @ApiProperty({
    description: '현재일자를 기준으로 조회하고자 하는 일자의 범위',
    example: '오늘을 포함한 일주일 == 7',
  })
  daysFromNow: number;

  @ApiProperty({
    description: '대여 횟수',
    example: '10',
  })
  lentCount: number;

  @ApiProperty({
    description: '반납 횟수',
    example: '10',
  })
  returnCount: number;
}
