import React from "react";
import { useRecoilValue } from "recoil";
import {
  currentSectionCabinetState,
  currentSectionColNumState,
} from "@/recoil/selectors";
import CabinetListContainer from "@/containers/CabinetListContainer";
import RealViewNotification from "./RealViewNotification";
import { CabinetInfo } from "@/types/dto/cabinet.dto";

const CabinetList = (): JSX.Element => {
  const colNum = useRecoilValue(currentSectionColNumState);
  const CABINETS = useRecoilValue<CabinetInfo[]>(currentSectionCabinetState);

  return (
    <React.Fragment>
      <RealViewNotification colNum={colNum} />
      {colNum && (
        <CabinetListContainer colNum={colNum} cabinetInfo={CABINETS} />
      )}
    </React.Fragment>
  );
};

export default CabinetList;
