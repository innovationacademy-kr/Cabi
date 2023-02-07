import { useRecoilState, useResetRecoilState } from "recoil";
import {
  targetCabinetInfoListState,
  isMultiSelectState,
} from "./../recoil/atoms";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
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

  const openMultiSelectMode = () => {
    setIsMultiSelect(true);
  };

  const closeMultiSelectMode = () => {
    setIsMultiSelect(false);
    resetTargetCabinetInfoList();
  };

  const containsCabinet = (cabinetId: number) => {
    if (targetCabinetInfoList.find((c) => c.cabinet_id === cabinetId))
      return true;
    return false;
  };

  const clickCabinetOnMultiSelectMode = (cabinet: CabinetInfo) => {
    if (!containsCabinet(cabinet.cabinet_id)) {
      setTargetCabinetInfoList([...targetCabinetInfoList, cabinet]);
      return;
    }
    setTargetCabinetInfoList(
      targetCabinetInfoList.filter((c) => c.cabinet_id != cabinet.cabinet_id)
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

  const initMultiSelectMode = () => {
    resetIsMultiSelect();
    resetTargetCabinetInfoList();
  };

  return {
    isMultiSelect,
    setIsMultiSelect,
    resetIsMultiSelect,
    resetTargetCabinetInfoList,
    openMultiSelectMode,
    closeMultiSelectMode,
    containsCabinet,
    clickCabinetOnMultiSelectMode,
    containsAllCabinets,
    handleSelectAll,
    initMultiSelectMode,
  };
};

export default useMultiSelect;
