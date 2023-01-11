
import { ApiProperty } from '@nestjs/swagger';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';

/**
 * 캐비넷을 대여하기 전 캐비넷에 대한 최소 정보
 */
export class LentCabinetDataDto {
  @ApiProperty({
    description: '캐비닛의 상태',
    example: 'AVAILABLE, EXPIRED...',
  })
  status: CabinetStatusType; // 사물함의 상태
  
  @ApiProperty({
    description: '캐비닛의 타입',
    example: 'PRIVATE, SHARE, CIRCLE',
  })
  lent_type: LentType; // 사물함의 타입
  
  @ApiProperty({
    description: '해당 캐비닛을 대여한 사람의 수',
    example: 3,
  })
  lent_count: number; // 해당 케비넷을 대여한 사람의 수
  
  @ApiProperty({
    description: '사물함이 대여 중일 때 대여한 유저의 만료 시간',
    example: 3306,
  })
  expire_time?: Date; // 사물함이 대여 중일 때 대여한 유저의 만료 시간
  
  @ApiProperty({
    description: '해당 캐비닛을 빌릴 수 있는 유저 수의 상한',
    example: 3,
  })
  max_user: number; // 해당 사물함을 최대로 빌릴 수 있는 유저 수
}
