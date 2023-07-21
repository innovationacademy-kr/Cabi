import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

/**
 * 내 사물함을 업데이트할 때 송부할 정보
 */
export class UpdateCabinetMemoRequestDto {
  @ApiProperty({
    description: '캐비넷 메모',
    example:
      'credential한 정보를 적을 수 있는 캐비넷을 대여한 사람끼리만 공유하는 메모입니다.',
  })
  @IsString()
  @MaxLength(64)
  cabinet_memo: string; // 캐비넷 메모
}
