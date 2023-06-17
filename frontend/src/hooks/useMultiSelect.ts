import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  isMultiSelectState,
  selectedTypeOnSearchState,
  targetCabinetInfoListState,
} from "@/recoil/atoms";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import useMenu from "@/hooks/useMenu";

const useMultiSelect = () => {
  const [targetCabinetInfoList, setTargetCabinetInfoList] = useRecoilState<
    CabinetInfo[]
  >(targetCabinetInfoListState);
  const [isMultiSelect, setIsMultiSelect] =
    useRecoilState<boolean>(isMultiSelectState);
  const resetTargetCabinetInfoList = useResetRecoilState(
    targetCabinetInfoListState
  );
  const resetIsMultiSelect = useResetRecoilState(isMultiSelectState);
  const setSelectedTypeOnSearch = useSetRecoilState(selectedTypeOnSearchState);
  const { closeCabinet } = useMenu();

  const openMultiSelectMode = () => {
    closeCabinet();
    setIsMultiSelect(true);
  };

  const closeMultiSelectMode = () => {
    setIsMultiSelect(false);
    resetTargetCabinetInfoList();
    closeCabinet();
  };

  const toggleMultiSelectMode = () => {
    if (isMultiSelect) {
      closeMultiSelectMode();
      return;
    }
    openMultiSelectMode();
  };

  const containsCabinet = (cabinetId: number) => {
    if (targetCabinetInfoList.find((c) => c.cabinetId === cabinetId))
      return true;
    return false;
  };

  const clickCabinetOnMultiSelectMode = (cabinet: CabinetInfo) => {
    setSelectedTypeOnSearch("CABINET");
    if (!containsCabinet(cabinet.cabinetId)) {
      setTargetCabinetInfoList([...targetCabinetInfoList, cabinet]);
      return;
    }
    setTargetCabinetInfoList(
      targetCabinetInfoList.filter((c) => c.cabinetId != cabinet.cabinetId)
    );
  };

  const containsAllCabinets = (cabinets: CabinetInfo[]) => {
    if (targetCabinetInfoList.length === cabinets.length) {
      return true;
    }
    return false;
  };

  const handleSelectAll = (cabinets: CabinetInfo[]) => {
    if (containsAllCabinets(cabinets)) {
      resetTargetCabinetInfoList();
      return;
    }
    setTargetCabinetInfoList(cabinets);
  };

  const resetMultiSelectMode = () => {
    resetIsMultiSelect();
    resetTargetCabinetInfoList();
  };

  const isSameType = (cabinets: CabinetInfo[]) => {
    const type = cabinets[0].lentType;
    for (const cabinet of cabinets) {
      if (cabinet.lentType !== type) return false;
    }
    return true;
  };

  const isSameStatus = (cabinets: CabinetInfo[]) => {
    const status = cabinets[0].status;
    for (const cabinet of cabinets) {
      if (cabinet.status !== status) return false;
    }
    return true;
  };

  const isAllEmpty = (cabinets: CabinetInfo[]) => {
    for (const cabinet of cabinets) {
      if (cabinet.lents.length !== 0) return false;
    }
    return true;
  };

  return {
    isMultiSelect,
    targetCabinetInfoList,
    setTargetCabinetInfoList,
    setIsMultiSelect,
    resetIsMultiSelect,
    resetTargetCabinetInfoList,
    openMultiSelectMode,
    closeMultiSelectMode,
    toggleMultiSelectMode,
    containsCabinet,
    clickCabinetOnMultiSelectMode,
    containsAllCabinets,
    handleSelectAll,
    resetMultiSelectMode,
    isSameType,
    isSameStatus,
    isAllEmpty,
  };
};

export default useMultiSelect;
