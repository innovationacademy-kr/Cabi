import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { LentExtensionDto } from "@/types/dto/lent.dto";

export interface UserDto {
  userId: number | null; // 42 고유 ID
  name: string | null; // 42 로그인 ID
  // TODO:
  // mock 데이터와 충돌 생겨서 옵셔널 필드로 바꿨습니다. 추후 수정 필요합니다.
  cabinetId: number | null; // 캐비닛 고유 ID
  lentExtension: LentExtensionDto | null;
}

export interface UserInfo {
  name: string;
  userId: number | null;
  cabinetId?: number | null;
  bannedAt?: Date | null;
  unbannedAt?: Date | null;
  cabinetInfo?: CabinetInfo | null;
}
