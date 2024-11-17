import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentFloorSectionNamesState,
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
  currentFloor: number;
}

const CabinetListContainer = ({
  isAdmin, currentFloor
}: ICabinetListContainer): JSX.Element => {
  const colNum = useRecoilValue(currentSectionColNumState);
  const currentSectionCabinets = useRecoilValue<CabinetPreviewInfo[]>(
    currentSectionCabinetState
  );
  const currentSectionName = useRecoilValue<string>(currentSectionNameState);
  const isMultiSelect = useRecoilValue<boolean>(isMultiSelectState);
  const { handleSelectAll, containsAllCabinets } = useMultiSelect();
  const [currentFloorSectionNames] = useRecoilState(
    currentFloorSectionNamesState
  );

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
      {currentFloorSectionNames.includes(currentSectionName) && (currentFloor !== 4) && (
        <RealViewNotification colNum={colNum as number} />
      )}
      {(!isAdmin && currentFloor === 4) ? (
        <EmptySection message={"4층은 현재 이용 불가입니다!"} />
      ) : (
        <>
          <CabinetList
            colNum={colNum as number}
            cabinetInfo={currentSectionCabinets}
            isAdmin={isAdmin}
          />
          {(currentSectionName === SectionType.elevator ||
            currentSectionName === SectionType.stairs) && (
              <EmptySection message={"여기엔 사물함이 없어요!"} />
            )}
        </>
      )}
    </React.Fragment>
  );
};

export default CabinetListContainer;
