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
