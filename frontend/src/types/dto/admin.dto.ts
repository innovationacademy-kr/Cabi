export interface BannedUserDto {
  user_id: number;
  intra_id: string;
  banned_date: Date;
  unbanned_date: Date;
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
  lentCount: number;
  returnCount: number;
}

export interface ITableData {
  first?: string;
  second?: string;
  third?: string;
  info: BannedUserDto | BrokenCabinetDto | OverdueUserDto;
}
