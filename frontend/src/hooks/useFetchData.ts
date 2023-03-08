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
} from "@/components/AdminInfo/convertFunctions";
import {
  ICabinetNumbersPerFloor,
  IData,
  IMonthlyData,
} from "@/types/dto/admin.dto";
import { SetterOrUpdater } from "recoil";

export async function useFetchData(
  setMonthlyData: React.Dispatch<React.SetStateAction<IMonthlyData[]>>,
  setBannedUserList: React.Dispatch<React.SetStateAction<IData[]>>,
  setBrokenCabinetList: SetterOrUpdater<IData[]>,
  setCabinetNumbersPerFloor: React.Dispatch<
    React.SetStateAction<ICabinetNumbersPerFloor[]>
  >,
  setOverdueUserList: SetterOrUpdater<IData[]>
) {
  const bannedUserData = await axiosGetBannedUserList();
  const brokenCabinetData = await axiosGetBrokenCabinetList();
  const cabinetNumbersPerFloorData = await axiosGetCabinetNumbersPerFloor();
  const overdueUserData = await axiosGetOverdueUserList();

  console.log(overdueUserData);

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
