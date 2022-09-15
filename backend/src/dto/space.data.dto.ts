import { ApiProperty } from '@nestjs/swagger';

/**
 * cabi 관리 대상인 사물함의 건물 정보와 층 수의 정보를 저장
 */
export class SpaceDataDto {
  @ApiProperty({
    description: '사물함이 존재하는 건물 이름',
    example: '새롬관',
  })
  location: string; // 건물 정보 (ex. 새롬관)

  @ApiProperty({
    description: '해당 건물에 존재하는 층 정보의 배열',
    example: [1, 2, 3],
  })
  floors: number[]; // 해당 건물에 존재하는 층 정보의 배열
}
