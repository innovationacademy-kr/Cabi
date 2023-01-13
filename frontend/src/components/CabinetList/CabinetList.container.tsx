import React from "react";
import { useRecoilValue } from "recoil";
import {
  currentSectionCabinetState,
  currentSectionColNumState,
} from "@/recoil/selectors";
import CabinetList from "@/components/CabinetList/CabinetList";
import RealViewNotification from "@/components/CabinetList/RealViewNotification/RealViewNotification";
import { CabinetInfo } from "@/types/dto/cabinet.dto";

const CabinetListContainer = (): JSX.Element => {
  const colNum = useRecoilValue(currentSectionColNumState);
  const currentSectionCabinets = useRecoilValue<CabinetInfo[]>(
    currentSectionCabinetState
  );

  return (
    <React.Fragment>
      {colNum && <RealViewNotification colNum={colNum} />}
      {colNum && (
        <CabinetList colNum={colNum} cabinetInfo={currentSectionCabinets} />
      )}
    </React.Fragment>
  );
};

export default CabinetListContainer;
