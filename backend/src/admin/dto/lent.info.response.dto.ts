import { ApiProperty } from '@nestjs/swagger';
import { LentInfoDto } from 'src/admin/dto/lent.info.dto';

/**
  캐비넷 대여 사물함의 정보를 나타내는 DTO입니다.
 */
export class LentInfoResponseDto {
  @ApiProperty({
    description: '대여 기록의 배열',
    type: [LentInfoDto],
  })
  lentInfo: LentInfoDto[];
}
