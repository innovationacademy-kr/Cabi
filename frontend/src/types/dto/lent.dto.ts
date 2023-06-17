import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

/**
 * @interface
 * @description 대여 기록 데이터
 * @property {number} user_id : 유저 인트라 번호
 * @property {string} intra_id : 유저 인트라 아이디
 * @property {number} lent_id : 대여 고유 ID
 * @property {Date} lent_time : 대여한 시간
 * @property {Date} expire_time : 만료 시간
 */
export interface LentDto {
  userId: number;
  name: string;
  lentHistoryId: number;
  startedAt: Date;
  expiredAt: Date;
}

export interface LentLogDto {
  location: string;
  floor: number;
  section: string;
  cabinetId: number;
  visibleNum: number;
  name: string;
  lent_time: Date;
  return_time: Date;
  user_id: number;
}

export interface ActivationDto {
  floor: number;
  visibleNum: number;
  note: string | null;
}

export interface BanDto {
  visibleNum: number;
  floor: number;
  section: string;
}

export type LentLogResponseType =
  | LentLogDto[]
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
