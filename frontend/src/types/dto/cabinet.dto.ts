import { LentDto } from "@/types/dto/lent.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";

// TODO :hybae
// lentType을 LentType으로 변경 예정
export interface MyCabinetInfoResponseDto extends CabinetInfo {
  memo: string; // 사물함 비밀번호와 관련된 메모
}

export interface CabinetBuildingFloorDto {
  building: string;
  floors: Array<number>;
}

export interface CabinetSimple {
  cabinetId: number;
  building: string;
  floor: number;
  section: string;
  visibleNum: number;
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

export interface CabinetPreview {
  section: string;
  cabinets: CabinetPreviewInfo[];
}

export interface CabinetPreviewInfo {
  cabinetId: number;
  name: string;
  visibleNum: number;
  lentType: CabinetType;
  title: string | null;
  userCount: number;
  maxUser: number;
  status: CabinetStatus;
}

export interface CabinetInfoByBuildingFloorDto {
  section: string; // swagger의 CabinetPerSectionDto에 맞추어 object -> string으로 수정했습니다.
  cabinets: CabinetPreviewInfo[];
}
