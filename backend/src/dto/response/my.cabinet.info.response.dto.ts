import { CabinetExtendDto } from '../cabinet.extend.dto';
import { LentDto } from '../lent.dto';

/**
 * 내 사물함에 대한 정보 (메모 포함)와 대여한 사람들 정보
 * @extends CabinetExtendDto
 */
export class MyCabinetInfoResponseDto extends CabinetExtendDto {
  is_lent: boolean; // 대여했는지 여부 - 기존 activation
  lent_info: LentDto[]; // 대여한 유저의 정보 (없다면 빈 배열)
}
