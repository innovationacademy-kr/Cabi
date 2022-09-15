import { ApiProperty } from '@nestjs/swagger';
import { CabinetDto } from './cabinet.dto';

/**
 * 사물함에 대한 추가 정보
 * @extends CabinetDto
 */
export class CabinetExtendDto extends CabinetDto {
  @ApiProperty({
    description: '사물함이 존재하는 건물 이름',
    example: '새롬관',
  })
  location: string; // 사물함 건물

  @ApiProperty({
    description: '사물함이 존재하는 층수',
    example: 2,
  })
  floor: number; // 사물함 층수

  @ApiProperty({
    description: '사물함의 섹션 종류 (오아시스 등)',
    example: 'Oasis',
  })
  section: string; // 사물함의 섹션 종류 (오아시스 등)

  @ApiProperty({
    description: '사물함 비밀번호와 관련된 메모',
    example: '비밀번호는 1234입니다',
  })
  cabinet_memo: string; // 사물함 비밀번호와 관련된 메모
}
