import { SetterOrUpdater } from "recoil";
import {
  ICabinetNumbersPerFloor,
  IMonthlyData,
  ITableData,
} from "@/types/dto/admin.dto";
import {
  axiosGetBannedUserList,
  axiosGetBrokenCabinetList,
  axiosGetCabinetNumbersPerFloor,
  axiosGetOverdueUserList,
  axiosGetStatistics,
} from "@/api/axios/axios.custom";
import {
  handleBannedUserList,
  handleBrokenCabinetList,
  handleOverdueUserList,
} from "@/utils/tableUtils";

export async function useAdminHomeApi(
  setMonthlyData: React.Dispatch<React.SetStateAction<IMonthlyData[]>>,
  setBannedUserList: SetterOrUpdater<ITableData[]>,
  setBrokenCabinetList: SetterOrUpdater<ITableData[]>,
  setCabinetNumbersPerFloor: React.Dispatch<
    React.SetStateAction<ICabinetNumbersPerFloor[]>
  >,
  setOverdueUserList: SetterOrUpdater<ITableData[]>
) {
  const bannedUserData = await axiosGetBannedUserList();
  const brokenCabinetData = await axiosGetBrokenCabinetList();
  const cabinetNumbersPerFloorData = await axiosGetCabinetNumbersPerFloor();
  const overdueUserData = await axiosGetOverdueUserList();
  const statisticsData: any[] = [];
  let currentDate = new Date();
  let dates = [];
  dates[0] = new Date();
  for (let i = 1; i < 5; i++) {
    dates[i] = new Date(currentDate.setDate(currentDate.getDate() - 7));
  }
  statisticsData[0] = await axiosGetStatistics(dates[4], dates[3]);
  statisticsData[1] = await axiosGetStatistics(dates[3], dates[2]);
  statisticsData[2] = await axiosGetStatistics(dates[2], dates[1]);
  statisticsData[3] = await axiosGetStatistics(dates[1], dates[0]);
  setMonthlyData(statisticsData);
  setBannedUserList(handleBannedUserList(bannedUserData));
  setBrokenCabinetList(handleBrokenCabinetList(brokenCabinetData));
  setCabinetNumbersPerFloor(cabinetNumbersPerFloorData);
  setOverdueUserList(handleOverdueUserList(overdueUserData));
}
