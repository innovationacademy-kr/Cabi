import Lent from 'src/entities/lent.entity';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';

/**
 * 캐비넷을 대여하기 전 캐비넷에 대한 최소 정보
 */
export class ReturnCabinetDataDto {
  status: CabinetStatusType; // 사물함의 상태
  lent_type: LentType; // 사물함의 타입
  lents: Lent[]; // 해당 사물함을 대여하고 있는 lent 배열
}
