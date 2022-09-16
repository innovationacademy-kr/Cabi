import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { LentType } from 'src/enum/lent.type.enum';

/**
 * 사물함에 대한 기본 정보
 */
export class CabinetDto {
  @ApiProperty({
    description: '캐비넷 고유 ID',
    example: 1234,
  })
  @IsNumber()
  cabinet_id: number; // 캐비넷 고유 ID

  @ApiProperty({
    description: '사물함에 붙어있는 숫자',
    example: 12,
  })
  @IsNumber()
  cabinet_num: number; // 사물함에 붙어있는 숫자

  @ApiProperty({
    description: '사물함의 종류 (개인, 공유, 동아리)',
    enum: ['PRIVATE', 'SHARE', 'CIRCLE'],
    example: 'PRIVATE',
  })
  @IsEnum(LentType)
  lent_type: LentType; // 사물함의 종류 (개인, 공유, 동아리)

  @ApiProperty({
    description: '사물함에 대한 설명',
    example: '푸주와 아이들이 사용하는 사물함입니다',
  })
  @IsString()
  cabinet_title: string; // 사물함에 대한 설명

  @ApiProperty({
    description: '해당 사물함을 대여할 수 있는 최대 유저 수',
    example: 3,
  })
  @IsNumber()
  max_user = 3; // 해당 사물함을 대여할 수 있는 최대 유저 수
}
