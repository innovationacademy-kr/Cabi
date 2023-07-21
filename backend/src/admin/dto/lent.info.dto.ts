import { ApiProperty } from '@nestjs/swagger';

/**
 * 캐비넷 대여 사물함의 정보를 나타내는 DTO입니다.
 */
export class LentInfoDto {
  @ApiProperty({
    description: '대여 기록의 고유번호',
    example: 3306,
  })
  lent_id: number;

  @ApiProperty({
    description: '대여한 캐비닛의 id',
    example: 100,
  })
  lent_cabinet_id: number;

  @ApiProperty({
    description: '대여한 유저의 id',
    example: 131451,
  })
  lent_user_id: number;

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

  @ApiProperty({
    description: '연장 일자',
    example: 42,
  })
  extension: number;

  @ApiProperty({
    description: '인트라 ID',
    example: 'sanan',
  })
  intra_id: string;
}
