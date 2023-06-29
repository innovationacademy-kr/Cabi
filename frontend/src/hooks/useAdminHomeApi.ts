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
  statisticsData[0] = await axiosGetStatistics(21, 28);
  statisticsData[1] = await axiosGetStatistics(14, 21);
  statisticsData[2] = await axiosGetStatistics(7, 14);
  statisticsData[3] = await axiosGetStatistics(0, 7);
  setMonthlyData(statisticsData);
  setBannedUserList(handleBannedUserList(bannedUserData));
  setBrokenCabinetList(handleBrokenCabinetList(brokenCabinetData));
  setCabinetNumbersPerFloor(cabinetNumbersPerFloorData);
  setOverdueUserList(handleOverdueUserList(overdueUserData));
}
