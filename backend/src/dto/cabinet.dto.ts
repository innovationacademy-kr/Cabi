import { LentType } from 'src/enum/lent.type.enum';

/**
 * 사물함에 대한 기본 정보
 */
export class CabinetDto {
  cabinet_id: number; // 캐비넷 고유 ID
  cabinet_num: number; // 사물함에 붙어있는 숫자
  lent_type: LentType; // 사물함의 종류 (개인, 공유, 동아리)
  cabinet_title: string; // 공유/동아리 사물함인 경우 사물함에 대한 설명
  max_user: number; // 해당 사물함을 대여할 수 있는 최대 유저 수
}
