import { LentDto } from "@/types/dto/lent.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";

// TODO :hybae
// lentType을 LentType으로 변경 예정
export interface MyCabinetInfoResponseDto extends CabinetInfo {
  cabinet_memo: string; // 사물함 비밀번호와 관련된 메모
}

export interface CabinetBuildingFloorDto {
  building: string;
  floors: Array<number>;
}

export interface CabinetInfo {
  building: string;
  floor: number;
  cabinetId: number;
  visibleNum: number;
  lentType: CabinetType;
  title: string | null;
  maxUser: number;
  status: CabinetStatus;
  section: string;
  lents: LentDto[];
  statusNote: string | null;
}

export interface CabinetInfoByBuildingFloorDto {
  section: string; // swagger의 CabinetPerSectionDto에 맞추어 object -> string으로 수정했습니다.
  cabinets: CabinetInfo[];
}
