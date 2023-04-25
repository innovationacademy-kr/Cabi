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
import { currentSectionNameState, isMultiSelectState } from "@/recoil/atoms";
import MultiSelectFilterButton from "@/components/Common/MultiSelectFilterButton";
import useMultiSelect from "@/hooks/useMultiSelect";

interface ICabinetListContainer {
  isAdmin: boolean;
}

const CabinetListContainer = ({
  isAdmin,
}: ICabinetListContainer): JSX.Element => {
  const colNum = useRecoilValue(currentSectionColNumState);
  const currentSectionCabinets = useRecoilValue<CabinetInfo[]>(
    currentSectionCabinetState
  );
  const currentSectionName = useRecoilValue<string>(currentSectionNameState);
  const isMultiSelect = useRecoilValue<boolean>(isMultiSelectState);
  const { handleSelectAll, containsAllCabinets } = useMultiSelect();
  return (
    <React.Fragment>
      {isMultiSelect && (
        <div style={{ marginTop: "4px", marginBottom: "4px" }}>
          <MultiSelectFilterButton
            theme={
              containsAllCabinets(currentSectionCabinets) ? "fill" : "line"
            }
            text="전체선택"
            onClick={() => {
              handleSelectAll(currentSectionCabinets);
            }}
          />
        </div>
      )}
      <RealViewNotification colNum={colNum as number} />
      <CabinetList
        colNum={colNum as number}
        cabinetInfo={currentSectionCabinets}
        isAdmin={isAdmin}
      />
      {currentSectionName === "E/V" && (
        <EmptySection message={"여기엔 사물함이 없어요!"} />
      )}
      {currentSectionName !== "E/V" && currentSectionCabinets.length === 0 && (
        <EmptySection message={"사물함 오픈 준비중!"} />
      )}
    </React.Fragment>
  );
};

export default CabinetListContainer;
