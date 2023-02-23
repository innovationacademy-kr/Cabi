import { ApiProperty } from '@nestjs/swagger';

export class AdminStatisticsDto {
  @ApiProperty({
    description: '검색 시작 날짜',
    example: '2023-02-22 20:43:24',
  })
  startDate: Date;

  @ApiProperty({
    description: '검색 종료 날짜',
    example: '2023-02-22 20:43:24',
  })
  endDate: Date;

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
