import React from "react";
import { useRecoilValue } from "recoil";
import {
  currentSectionCabinetState,
  currentSectionColNumState,
} from "@/recoil/selectors";
import CabinetList from "@/components/CabinetList/CabinetList";
import RealViewNotification from "@/components/CabinetList/RealViewNotification/RealViewNotification";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import EmptySection from "@/components/CabinetList/EmptySection/EmptySection";
import { currentSectionNameState } from "@/recoil/atoms";

const CabinetListContainer = (): JSX.Element => {
  const colNum = useRecoilValue(currentSectionColNumState);
  const currentSectionCabinets = useRecoilValue<CabinetInfo[]>(
    currentSectionCabinetState
  );
  const currentSectionName = useRecoilValue<string>(currentSectionNameState);
  return (
    <React.Fragment>
      <RealViewNotification colNum={colNum as number} />
      <CabinetList
        colNum={colNum as number}
        cabinetInfo={currentSectionCabinets}
      />
      {currentSectionName == "E/V" && <EmptySection />}
    </React.Fragment>
  );
};

export default CabinetListContainer;
