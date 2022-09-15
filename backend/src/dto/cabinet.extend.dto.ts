import { CabinetDto } from './cabinet.dto';

/**
 * 사물함에 대한 추가 정보
 * @extends CabinetDto
 */
export class CabinetExtendDto extends CabinetDto {
  location: string; // 사물함 건물
  floor: number; // 사물함 층수
  section: string; // 사물함의 섹션 종류 (오아시스 등)
  cabinet_memo: string; // 사물함 비밀번호와 관련된 메모
}
