import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentFloorCabinetState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import {
  CabinetInfo,
  CabinetPreview,
  CabinetPreviewInfo,
} from "@/types/dto/cabinet.dto";
import {
  axiosCabinetByBuildingFloor,
  axiosCabinetById,
  axiosMyLentInfo,
} from "@/api/axios/axios.custom";

const shouldUpdateTargetCabinetInfo = (
  cabinet: CabinetPreviewInfo,
  cabinetInfo: CabinetInfo
) => {
  return (
    cabinet.userCount !== cabinetInfo.lents.length ||
    cabinet.status !== cabinetInfo.status
  );
};

const useCabinetListRefresh = (
  currentBuilding: string,
  currentFloor: number
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [myCabinetInfo, setMyLentInfo] = useRecoilState(myCabinetInfoState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setCurrentFloorData = useSetRecoilState(currentFloorCabinetState);

  const fetchAndUpdateCabinetData = async () => {
    try {
      const floorData = await axiosCabinetByBuildingFloor(
        currentBuilding,
        currentFloor
      );
      setCurrentFloorData(floorData.data);

      const targetCabinet = floorData.data
        .flatMap((cluster: CabinetPreview) => cluster.cabinets)
        .find(
          (cabinet: CabinetPreviewInfo) =>
            cabinet.cabinetId === myCabinetInfo?.cabinetId
        );
      if (
        targetCabinet &&
        shouldUpdateTargetCabinetInfo(targetCabinet, myCabinetInfo)
      ) {
        const fullInfo = await axiosCabinetById(targetCabinet.cabinetId);
        setTargetCabinetInfo(fullInfo.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshCabinetList = async () => {
    setIsLoading(true);
    try {
      if (
        myInfo.cabinetId !== myCabinetInfo.cabinetId &&
        myCabinetInfo.cabinetId
      ) {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
        setMyInfo({ ...myInfo, cabinetId: myLentInfo.cabinetId });
      }
      await fetchAndUpdateCabinetData();
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 350);
    }
  };

  return { refreshCabinetList, isLoading };
};

export default useCabinetListRefresh;
