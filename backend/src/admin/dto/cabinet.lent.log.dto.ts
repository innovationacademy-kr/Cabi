import { ApiProperty } from '@nestjs/swagger';

export class CabinetLentLogDto {
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
    description: '캐비넷 고유 ID',
    example: 1234,
  })
  cabinet_id: number; // 캐비넷 고유 ID

  @ApiProperty({
    description: '사물함에 붙어있는 숫자',
    example: 12,
  })
  cabinet_num: number; // 사물함에 붙어있는 숫자

  @ApiProperty({
    description: '사물함이 존재하는 건물 이름',
    example: '새롬관',
  })
  location: string; // 사물함 건물

  @ApiProperty({
    description: '사물함이 존재하는 층수',
    example: 2,
  })
  floor: number; // 사물함 층수

  @ApiProperty({
    description: '사물함의 섹션 종류 (오아시스 등)',
    example: 'Oasis',
  })
  section: string; // 사물함의 섹션 종류 (오아시스 등)

  @ApiProperty({
    description: '대여한 시간',
    example: '2022-08-24 13:03:03',
  })
  lent_time: Date; // 대여한 시간

  @ApiProperty({
    description: '반납 시간',
    example: '2022-08-24 13:03:03',
  })
  return_time: Date; // 반납 시간
}
