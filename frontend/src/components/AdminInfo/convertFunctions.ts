import {
  BannedUserDto,
  BrokenCabinetDto,
  OverdueUserDto,
} from "@/types/dto/admin.dto";

interface IData {
  first?: string;
  second?: string;
  third?: string;
  info: BannedUserDto | BrokenCabinetDto | OverdueUserDto;
}

const calcLeftDays = (end: Date) =>
  Math.ceil((end.getTime() - new Date().getTime()) / 1000 / 3600 / 24);

const convertDate = (date: Date): string =>
  `~ ${date.getFullYear() % 100}.${
    date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)
  }.${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;

export const handleBannedUserList = (data: BannedUserDto[]): IData[] =>
  data
    .map(({ intra_id, banned_date, unbanned_date }, idx, arr) => ({
      first: intra_id,
      second: calcLeftDays(new Date(unbanned_date)).toString(),
      third: convertDate(new Date(unbanned_date)),
      info: arr[idx],
    }))
    .sort(
      (personA, personB) => Number(personB.second) - Number(personA.second)
    );

export const handleBrokenCabinetList = (data: BrokenCabinetDto[]): IData[] =>
  data.map(({ floor, cabinet_num, section, note }, idx, arr) => ({
    first: `${floor}F-${cabinet_num}`,
    second: section,
    third: note || "",
    info: arr[idx],
  }));

export const handleOverdueUserList = (data: OverdueUserDto[]): IData[] =>
  data.map(({ intra_id, location, overdueDays }, idx, arr) => ({
    first: intra_id,
    second: location.toUpperCase(),
    third: overdueDays.toString(),
    info: arr[idx],
  }));
