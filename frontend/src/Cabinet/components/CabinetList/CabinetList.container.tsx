import React from "react";
import { useRecoilValue } from "recoil";
import {
  currentSectionNameState,
  isMultiSelectState,
} from "@/Cabinet/recoil/atoms";
import {
  currentSectionCabinetState,
  currentSectionColNumState,
} from "@/Cabinet/recoil/selectors";
import CabinetList from "@/Cabinet/components/CabinetList/CabinetList";
import EmptySection from "@/Cabinet/components/CabinetList/EmptySection/EmptySection";
import RealViewNotification from "@/Cabinet/components/CabinetList/RealViewNotification/RealViewNotification";
import MultiSelectFilterButton from "@/Cabinet/components/Common/MultiSelectFilterButton";
import { CabinetPreviewInfo } from "@/Cabinet/types/dto/cabinet.dto";
import SectionType from "@/Cabinet/types/enum/map.type.enum";
import useMultiSelect from "@/Cabinet/hooks/useMultiSelect";

interface ICabinetListContainer {
  isAdmin: boolean;
}

const CabinetListContainer = ({
  isAdmin,
}: ICabinetListContainer): JSX.Element => {
  const colNum = useRecoilValue(currentSectionColNumState);
  const currentSectionCabinets = useRecoilValue<CabinetPreviewInfo[]>(
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
      {(currentSectionName === SectionType.elevator ||
        currentSectionName === SectionType.stairs) && (
        <EmptySection message={"여기엔 사물함이 없어요!"} />
      )}
    </React.Fragment>
  );
};

export default CabinetListContainer;
