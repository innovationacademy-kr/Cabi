import { STATUS_400_BAD_REQUEST } from "@/Cabinet/constants/StatusCode";

/**
 * @interface
 * @description 대여 기록 데이터
 * @property {number} userId : 유저 인트라 번호
 * @property {string} name : 유저 인트라 아이디
 * @property {number} lentHistoryId : 대여 고유 ID
 * @property {Date} startedAt : 대여한 시간
 * @property {Date} expiredAt : 만료 시간
 */
export interface LentDto {
  userId: number;
  name: string;
  lentHistoryId: number;
  startedAt: Date;
  expiredAt: Date;
}

export interface LentHistoryDto {
  userId: number;
  name: string;
  cabinetId: number;
  visibleNum: number;
  building: string;
  floor: number;
  section: string;
  startedAt: Date;
  endedAt: Date;
}

export type LentLogResponseType =
  | LentHistoryDto[]
  | typeof STATUS_400_BAD_REQUEST
  | undefined;

export interface ILentLog {
  closeLent: React.MouseEventHandler;
  logs: LentLogResponseType;
  page: number;
  totalPage: number;
  onClickPrev: React.MouseEventHandler;
  onClickNext: React.MouseEventHandler;
}

export interface ClubUserDto {
  clubId: number;
  clubName: string;
  clubMaster: string;
}

export type ClubLogResponseType =
  | ClubUserDto[]
  | typeof STATUS_400_BAD_REQUEST
  | undefined;

export interface IClubLog {
  logs: ClubLogResponseType;
  page: number;
  totalPage: number;
  onClickPrev: React.MouseEventHandler;
  onClickNext: React.MouseEventHandler;
  changePageOnClickIndexButton: (index: number) => void;
}
export interface CabinetClubStatusRequestDto {
  userId: number;
  cabinetId: number;
  statusNote: string | null;
}

export interface LentExtensionDto {
  lentExtensionId: number;
  name: string;
  extensionPeriod: number;
  expiredAt: Date;
  extensionType: string;
}
