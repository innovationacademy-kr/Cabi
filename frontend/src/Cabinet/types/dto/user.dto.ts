import { AlarmInfo } from "@/Cabinet/types/dto/alarm.dto";
import { CabinetInfo } from "@/Cabinet/types/dto/cabinet.dto";
import { LentExtensionDto } from "@/Cabinet/types/dto/lent.dto";
import { IUserOauthConnection } from "@/Presentation/types/common/login";

/**
 * @description 유저 정보
 * @interface
 * @property {number} userId : 42 고유 ID
 * @property {string} name : 42 로그인 ID (인트라 아이디)
 * @property {number} cabinetId : 캐비닛 고유 ID
 * @property {LentExtensionDto} lentExtensionResponseDto : 연장권 정보
 * @property {Date} unbannedAt : 벤 해제 시간
 * @property {AlarmInfo} alarm : 알림 정보
 */
export interface UserDto {
  userId: number | null; // 42 고유 ID
  name: string | null; // 42 로그인 ID
  // TODO:
  // mock 데이터와 충돌 생겨서 옵셔널 필드로 바꿨습니다. 추후 수정 필요합니다.
  cabinetId: number | null; // 캐비닛 고유 ID
  lentExtensionResponseDto: LentExtensionDto | null;
  unbannedAt?: Date | null;
  alarmTypes: AlarmInfo | null;
  isDeviceTokenExpired: boolean | null;
  coins: number | null; // 보유 코인
  userOauthConnection: IUserOauthConnection | null;
}

export interface UserInfo {
  userId: number | null;
  name: string;
  cabinetId?: number | null;
  bannedAt?: Date | null;
  unbannedAt?: Date | null;
  cabinetInfo?: CabinetInfo | null;
  coins?: number | null;
}
