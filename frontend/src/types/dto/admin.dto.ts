export interface BannedUserDto {
  user_id: number;
  intra_id: string;
  banned_date: Date;
  unbanned_date: Date;
}

export interface BrokenCabinetDto {
  cabinet_id: number;
  cabinet_num: number;
  floor: number;
  lent_type: string;
  location: string;
  max_user: number;
  note: string | null;
  section: string;
}

export interface OverdueUserDto {
  intra_id: string;
  location: string;
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

export interface IData {
  first?: string;
  second?: string;
  third?: string;
  info: BannedUserDto | BrokenCabinetDto | OverdueUserDto;
}
