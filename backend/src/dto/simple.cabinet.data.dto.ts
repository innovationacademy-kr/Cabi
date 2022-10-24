import CabinetStatusType from "src/enums/cabinet.status.type.enum";
import LentType from "src/enums/lent.type.enum";

/**
 * 캐비넷을 대여하기 전 캐비넷에 대한 최소 정보
 */
export class SimpleCabinetDataDto {
  status: CabinetStatusType; // 사물함의 상태
  lent_type: LentType; // 사물함의 타입
  lent_count: number; // 해당 케비넷을 대여한 사람의 수
  expire_time?: Date; // 사물함이 대여 중일 때 대여한 유저의 만료 시간
  max_user: number; // 해당 사물함을 최대로 빌릴 수 있는 유저 수
}
