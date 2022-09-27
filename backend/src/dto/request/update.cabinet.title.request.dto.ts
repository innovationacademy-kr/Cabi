import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * 내 사물함을 업데이트할 때 송부할 정보
 */
export class UpdateCabinetTitleRequestDto {
  @ApiProperty({
    description: '캐비넷에 대한 설명',
    example: '푸주와 아이들이 사용하는 사물함입니다 ^.^',
  })
  @IsString()
  cabinet_title: string; // 케비넷 설명
}
