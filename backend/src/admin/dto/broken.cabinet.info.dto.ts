import { ApiProperty } from '@nestjs/swagger';
import LentType from 'src/enums/lent.type.enum';

export class BrokenCabinetInfoDto {
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
    description: '사물함의 종류 (개인, 공유, 동아리)',
    enum: LentType,
    example: 'PRIVATE',
  })
  lent_type: LentType; // 사물함의 종류 (개인, 공유, 동아리)

  @ApiProperty({
    description: '고장 사유',
    example: '잠금장치 고장',
  })
  note: string; // 고장 사유

  @ApiProperty({
    description: '해당 사물함을 대여할 수 있는 최대 유저 수',
    example: 3,
  })
  max_user: number; // 해당 사물함을 대여할 수 있는 최대 유저 수

  @ApiProperty({
    description: '사물함의 섹션 종류 (오아시스 등)',
    example: 'Oasis',
  })
  section: string; // 사물함의 섹션 종류 (오아시스 등)
}
