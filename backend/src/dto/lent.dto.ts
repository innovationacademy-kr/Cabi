import { ApiProperty } from '@nestjs/swagger';

/**
 * 기본적인 사물함 대여 정보
 */
export class LentDto {
  @ApiProperty({
    description: '42 고유 ID',
    example: 12345,
  })
  user_id: number; // 42 고유 ID

  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  intra_id: string; // 42 로그인 ID

  @ApiProperty({
    description: '대여 고유 ID',
    example: 1234,
  })
  lent_id: number; // 대여 고유 ID

  @ApiProperty({
    description: '대여한 시간',
    example: '2022-08-24 13:03:03',
  })
  lent_time: Date; // 대여한 시간

  @ApiProperty({
    description: '대여한 시간',
    example: '2022-08-24 13:03:03',
  })
  expire_time: Date; // 만료 시간

  @ApiProperty({
    description: '연체 되었는지 아닌지의 여부',
    example: false,
  })
  is_expired: boolean; // 연체 되었는지 아닌지의 여부
}
