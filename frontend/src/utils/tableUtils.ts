import {
  BannedUserDto,
  BrokenCabinetDto,
  ITableData,
  OverdueUserDto,
} from "@/types/dto/admin.dto";

const calcLeftDays = (end: Date) =>
  Math.ceil((end.getTime() - new Date().getTime()) / 1000 / 3600 / 24);

const convertDate = (date: Date): string =>
  `~ ${date.getFullYear() % 100}.${
    date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)
  }.${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;

export const handleBannedUserList = (data: BannedUserDto[]): ITableData[] =>
  data
    .map(({ name, bannedAt, unbannedAt }, idx, arr) => ({
      first: name,
      second: calcLeftDays(new Date(unbannedAt)).toString(),
      third: convertDate(new Date(unbannedAt)),
      info: arr[idx],
    }))
    .sort(
      (personA, personB) => Number(personB.second) - Number(personA.second)
    );

export const handleBrokenCabinetList = (
  data: BrokenCabinetDto[]
): ITableData[] =>
  data.map(({ floor, visibleNum, section, statusNote }, idx, arr) => ({
    first: `${floor}F-${visibleNum}`,
    second: section,
    third: statusNote || "",
    info: arr[idx],
  }));

export const handleOverdueUserList = (data: OverdueUserDto[]): ITableData[] =>
  data.map(({ name, floor, visibleNum, overdueDays }, idx, arr) => ({
    first: name,
    second: `${floor}F-${visibleNum}`,
    third: overdueDays.toString(),
    info: arr[idx],
  }));
