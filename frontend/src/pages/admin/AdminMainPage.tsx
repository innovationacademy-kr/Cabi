import { useEffect, useRef } from "react";
import styled from "styled-components";
import { currentFloorSectionState } from "@/recoil/selectors";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  currentFloorNumberState,
  currentSectionNameState,
  selectedTypeOnSearchState,
} from "@/recoil/atoms";
import { currentCabinetIdState, targetCabinetInfoState } from "@/recoil/atoms";
import useMenu from "@/hooks/useMenu";
import SectionPaginationContainer from "@/components/SectionPagination/SectionPagination.container";
import CabinetListContainer from "@/components/CabinetList/CabinetList.container";
import useMultiSelect from "@/hooks/useMultiSelect";
import MultiSelectButton from "@/components/Common/MultiSelectButton";

const MainPage = () => {
  const touchStartPosX = useRef(0);
  const touchStartPosY = useRef(0);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const { closeAll } = useMenu();
  const {
    isMultiSelect,
    toggleMultiSelectMode,
    resetMultiSelectMode,
    handleSelectAll,
  } = useMultiSelect();
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);
  const setSelectedTypeOnSearch = useSetRecoilState(selectedTypeOnSearchState);
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
  const currentSectionIdx = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );

  useEffect(() => {
    resetMultiSelectMode();
  }, [currentSectionIdx, currentFloorNumber]);

  const moveToLeftSection = () => {
    if (currentSectionIdx <= 0) {
      setCurrentSectionName(sectionList[sectionList.length - 1]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx - 1]);
    }
    mainWrapperRef.current?.scrollTo(0, 0);
  };

  const moveToRightSection = () => {
    if (currentSectionIdx >= sectionList.length - 1) {
      setCurrentSectionName(sectionList[0]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx + 1]);
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
    <WapperStyled
      ref={mainWrapperRef}
      onTouchStart={(e: React.TouchEvent) => {
        touchStartPosX.current = e.changedTouches[0].screenX;
        touchStartPosY.current = e.changedTouches[0].screenY;
      }}
      onTouchEnd={(e: React.TouchEvent) => {
        swipeSection(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
      }}
    >
      <SectionPaginationContainer />
      <div style={{ marginBottom: `${isMultiSelect ? "0px" : "4px"}` }}>
        <MultiSelectButton
          theme={isMultiSelect ? "fill" : "line"}
          text="다중 선택 모드"
          onClick={() => {
            toggleMultiSelectMode();
            setSelectedTypeOnSearch("CABINET");
          }}
        />
      </div>
      <CabinetListWrapperStyled>
        <CabinetListContainer isAdmin={true} />
      </CabinetListWrapperStyled>
    </WapperStyled>
  );
};

const WapperStyled = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  user-select: none;
`;

const CabinetListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
`;
export default MainPage;
