import { ApiPropertyOptional } from '@nestjs/swagger';
import { CabinetDto } from './cabinet.dto';
import { LentDto } from './lent.dto';

/**
 * 사물함에 대한 정보와 대여한 사람들 정보
 * @extends CabinetExtendDto
 */
export class CabinetInfoResponseDto extends CabinetDto {
  @ApiPropertyOptional({
    description: '대여되어 있을 경우 대여 정보',
    type: [LentDto],
  })
  lent_info?: LentDto[]; // 대여 정보 (optional)
}
