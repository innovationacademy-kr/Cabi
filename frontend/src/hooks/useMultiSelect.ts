import useMenu from "@/hooks/useMenu";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  targetCabinetInfoListState,
  isMultiSelectState,
} from "@//recoil/atoms";
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

  const resetMultiSelectMode = () => {
    resetIsMultiSelect();
    resetTargetCabinetInfoList();
  };

  return {
    isMultiSelect,
    targetCabinetInfoList,
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
  };
};

export default useMultiSelect;
