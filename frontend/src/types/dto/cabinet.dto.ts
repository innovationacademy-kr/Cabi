import { LentDto } from "@/types/dto/lent.dto";
import CabinetType from "@/types/enum/cabinet.type.enum";
import CabinetStatus from "@/types/enum/cabinet.status.enum";

// TODO :hybae
// lent_type을 LentType으로 변경 예정
export interface MyCabinetInfoResponseDto extends CabinetInfo {
  cabinet_memo: string; // 사물함 비밀번호와 관련된 메모
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
