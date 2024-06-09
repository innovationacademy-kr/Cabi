import { STATUS_400_BAD_REQUEST } from "@/Cabinet/constants/StatusCode";

export interface BannedUserDto {
  userId: number;
  name: string;
  bannedAt: Date;
  unbannedAt: Date;
}

export interface BrokenCabinetDto {
  cabinetId: number;
  visibleNum: number;
  maxUser: number;
  building: string;
  floor: number;
  section: string;
  lentType: string;
  status: string;
  statusNote: string | null;
  title: string;
}

export interface OverdueUserDto {
  building: string;
  floor: number;
  section: string;
  cabinetId: number;
  visibleNum: number;
  name: string;
  overdueDays: number;
}

export interface ICabinetNumbersPerFloor {
  floor: number;
  total: number;
  used: number;
  overdue: number;
  unused: number;
  disabled: number;
}

export interface IMonthlyData {
  startDate: string;
  endDate: string;
  lentStartCount: number;
  lentEndCount: number;
}

export interface ITableData {
  first?: string;
  second?: string;
  third?: string;
  info: BannedUserDto | BrokenCabinetDto | OverdueUserDto;
}

export interface IItemLog {
  closeItem: React.MouseEventHandler;
  logs: ItemLogResponseType;
  page: number;
  totalPage: number;
  onClickPrev: React.MouseEventHandler;
  onClickNext: React.MouseEventHandler;
}

export interface AdminItemHistoryDto {
  itemSku: string;
  itemName: string;
  itemDetails: string;
  issuedDate?: string;
  purchasedAt?: string;
  usedAt?: string;
}

export interface ItemLogResponse {
  itemHistories: AdminItemHistoryDto[];
  totalLength: number;
}

export type ItemLogResponseType =
  | ItemLogResponse
  | typeof STATUS_400_BAD_REQUEST
  | undefined;

export interface IItemUseCountDto {
  itemName: string;
  itemDetails: string;
  userCount: number;
}
