import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * 내 사물함을 업데이트할 때 송부할 정보
 */
export class UpdateCabinetInfoRequestDto {
  @ApiPropertyOptional({
    description: '캐비넷에 대한 설명',
    example: '푸주와 아이들이 사용하는 사물함입니다 ^.^',
  })
  @IsOptional()
  @IsString()
  cabinet_title?: string; // 케비넷 설명

  @ApiPropertyOptional({
    description: '캐비넷 메모',
    example:
      'credential한 정보를 적을 수 있는 캐비넷을 대여한 사람끼리만 공유하는 메모입니다.',
  })
  @IsOptional()
  @IsString()
  cabinet_memo?: string; // 캐비넷 메모
}
