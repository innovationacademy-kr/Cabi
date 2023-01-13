import { LentDto } from "./lent.dto";
import CabinetType from "../enum/cabinet.type.enum";
import CabinetStatus from "../enum/cabinet.status.enum";

// TODO :hybae
// lent_type을 LentType으로 변경 예정
export interface MyCabinetInfoResponseDto {
  status: CabinetStatus;
  lent_info?: LentDto[]; // 대여 정보 (optional)
  location: string; // 사물함 건물
  floor: number; // 사물함 층수
  section: string; // 사물함의 섹션 종류 (오아시스 등)
  cabinet_memo: string; // 사물함 비밀번호와 관련된 메모
  cabinet_id: number; // 캐비넷 고유 ID
  cabinet_num: number; // 사물함에 붙어있는 숫자
  lent_type: string; // 사물함의 종류 (개인, 공유, 동아리)
  cabinet_title: string; // 공유/동아리 사물함인 경우 사물함에 대한 설명
  max_user: number; // 해당 사물함을 대여할 수 있는 최대 유저 수
}

export interface CabinetLocationFloorDto {
  location: string;
  floors: Array<number>;
}

export interface CabinetInfo {
  cabinet_id: number;
  cabinet_num: number;
  lent_type: CabinetType;
  cabinet_title: string | null;
  max_user: number;
  status: CabinetStatus;
  section: string;
  location: string;
  floor: number;
  lent_info: LentDto[];
}

export interface CabinetInfoByLocationFloorDto {
  section: string; // swagger의 CabinetPerSectionDto에 맞추어 object -> string으로 수정했습니다.
  cabinets: CabinetInfo[];
}
