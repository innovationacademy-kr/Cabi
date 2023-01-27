import { ApiProperty } from '@nestjs/swagger';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';

/**
 * 사물함에 대한 기본 정보
 */
export class CabinetDto {
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
    enum: ['PRIVATE', 'SHARE', 'CLUB'],
    example: 'PRIVATE',
  })
  lent_type: LentType; // 사물함의 종류 (개인, 공유, 동아리)

  @ApiProperty({
    description: '사물함에 대한 설명',
    example: '푸주와 아이들이 사용하는 사물함입니다',
  })
  cabinet_title: string; // 사물함에 대한 설명

  @ApiProperty({
    description: '해당 사물함을 대여할 수 있는 최대 유저 수',
    example: 3,
  })
  max_user: number; // 해당 사물함을 대여할 수 있는 최대 유저 수

  @ApiProperty({
    description: '사물함 상태',
    enum: [
      'AVAILABLE',
      'SET_EXPIRE_FULL',
      'SET_EXPIRE_AVAILABLE',
      'EXPIRED',
      'BROKEN',
      'BANNED',
    ],
    example: 'PRIVATE',
  })
  status: CabinetStatusType; // 사물함의 현재 상태

  @ApiProperty({
    description: '사물함의 섹션 종류 (오아시스 등)',
    example: 'Oasis',
  })
  section: string; // 사물함의 섹션 종류 (오아시스 등)
}
