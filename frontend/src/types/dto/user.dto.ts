import { CabinetInfo } from "./cabinet.dto";

export interface UserDto {
  userId: number; // 42 고유 ID
  name: string; // 42 로그인 ID
  // TODO:
  // mock 데이터와 충돌 생겨서 옵셔널 필드로 바꿨습니다. 추후 수정 필요합니다.
  cabinetId: number; // 캐비닛 고유 ID
}

export interface UserInfo {
  intraId: string;
  userId: number;
  cabinetId?: number;
  bannedDate?: Date;
  unbannedDate?: Date;
  cabinetInfo?: CabinetInfo;
}
