import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentBuildingNameState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/recoil/atoms";
import { currentCabinetIdState, targetCabinetInfoState } from "@/recoil/atoms";
import { currentFloorSectionState } from "@/recoil/selectors";
import CabinetListContainer from "@/components/CabinetList/CabinetList.container";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import MultiSelectButton from "@/components/Common/MultiSelectButton";
import SectionPaginationContainer from "@/components/SectionPagination/SectionPagination.container";
import useCabinetListRefresh from "@/hooks/useCabinetListRefresh";
import useMenu from "@/hooks/useMenu";
import useMultiSelect from "@/hooks/useMultiSelect";

const AdminMainPage = () => {
  const touchStartPosX = useRef(0);
  const touchStartPosY = useRef(0);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const { closeAll } = useMenu();
  const { isMultiSelect, toggleMultiSelectMode, resetMultiSelectMode } =
    useMultiSelect();
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);
  const currentFloorNumber = useRecoilValue<number>(currentFloorNumberState);
  useEffect(() => {
    closeAll();
    resetTargetCabinetInfo();
    resetCurrentCabinetId();

    return () => {
      closeAll();
      resetTargetCabinetInfo();
      resetCurrentCabinetId();
    };
  }, []);

  const sectionList = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentBuilding = useRecoilValue<string>(currentBuildingNameState);
  const currentFloor = useRecoilValue<number>(currentFloorNumberState);
  const { refreshCabinetList, isLoading } = useCabinetListRefresh(
    currentBuilding,
    currentFloor
  );

  const currentSectionIndex = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );

  useEffect(() => {
    resetMultiSelectMode();
  }, [currentSectionIndex, currentFloorNumber]);

  const moveToLeftSection = () => {
    if (currentSectionIndex <= 0) {
      setCurrentSectionName(sectionList[sectionList.length - 1]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIndex - 1]);
    }
    mainWrapperRef.current?.scrollTo(0, 0);
  };

  const moveToRightSection = () => {
    if (currentSectionIndex >= sectionList.length - 1) {
      setCurrentSectionName(sectionList[0]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIndex + 1]);
    }
    mainWrapperRef.current?.scrollTo(0, 0);
  };

  const swipeSection = (touchEndPosX: number, touchEndPosY: number) => {
    const touchOffsetX = Math.round(touchEndPosX - touchStartPosX.current);
    const touchOffsetY = Math.round(touchEndPosY - touchStartPosY.current);
    if (
      Math.abs(touchOffsetX) < 50 ||
      Math.abs(touchOffsetX) < Math.abs(touchOffsetY)
    )
      return;
    if (touchOffsetX > 0) moveToLeftSection();
    else moveToRightSection();
  };

  return (
    <>
      {isLoading && <LoadingAnimation />}
      <WapperStyled
        ref={mainWrapperRef}
        onTouchStart={(e: React.TouchEvent) => {
          touchStartPosX.current = e.changedTouches[0].screenX;
          touchStartPosY.current = e.changedTouches[0].screenY;
        }}
        onTouchEnd={(e: React.TouchEvent) => {
          swipeSection(
            e.changedTouches[0].screenX,
            e.changedTouches[0].screenY
          );
        }}
      >
        <SectionPaginationContainer />
        <MultiSelectButtonWrapperStyled isMultiSelect={isMultiSelect}>
          <MultiSelectButton
            theme={isMultiSelect ? "fill" : "line"}
            text="다중 선택 모드"
            onClick={toggleMultiSelectMode}
          />
        </MultiSelectButtonWrapperStyled>
        <CabinetListWrapperStyled>
          <CabinetListContainer isAdmin={true} />

          <RefreshButtonStyled
            className="cabiButton"
            title="새로고침"
            id="refreshButton"
            onClick={refreshCabinetList}
          >
            새로고침
          </RefreshButtonStyled>
        </CabinetListWrapperStyled>
      </WapperStyled>
    </>
  );
};

const WapperStyled = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  user-select: none;
`;

const MultiSelectButtonWrapperStyled = styled.div<{ isMultiSelect: boolean }>`
  margin-bottom: ${({ isMultiSelect }) => (isMultiSelect ? "0px" : "4px")};
`;

const CabinetListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
`;

const RefreshButtonStyled = styled.button`
  max-width: 150px;
  width: 100%;
  height: 45px;
  padding: 10px 40px 10px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16px;
  border-radius: 30px;
  margin: 30px;
  @media (max-height: 745px) {
    margin-bottom: 8px;
  }
`;

export default AdminMainPage;
