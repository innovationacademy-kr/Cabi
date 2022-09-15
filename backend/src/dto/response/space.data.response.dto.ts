import { ApiProperty } from '@nestjs/swagger';
import { SpaceDataDto } from '../space.data.dto';

/**
 * cabi에 의해 관리되는 건물과 층 데이터
 */
export class SpaceDataResponseDto {
  @ApiProperty({
    description: '건물과 층 정보',
    type: [SpaceDataDto],
  })
  space_data: SpaceDataDto[];
}
