import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentBuildingNameState,
  currentCabinetIdState,
  currentFloorNumberState,
  currentSectionNameState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import { currentFloorSectionState } from "@/recoil/selectors";
import CabinetListContainer from "@/components/CabinetList/CabinetList.container";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import SectionPaginationContainer from "@/components/SectionPagination/SectionPagination.container";
import useCabinetListRefresh from "@/hooks/useCabinetListRefresh";
import useMenu from "@/hooks/useMenu";

const MainPage = () => {
  const touchStartPosX = useRef(0);
  const touchStartPosY = useRef(0);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const { closeAll } = useMenu();
  const navigator = useNavigate();
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);
  const sectionList = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentSectionIndex = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );
  const currentBuilding = useRecoilValue<string>(currentBuildingNameState);
  const currentFloor = useRecoilValue<number>(currentFloorNumberState);
  const { refreshCabinetList, isLoading } = useCabinetListRefresh(
    currentBuilding,
    currentFloor
  );

  useEffect(() => {
    const recoilPersist = localStorage.getItem("recoil-persist");
    if (recoilPersist) {
      const { CurrentFloor, CurrentSection } = JSON.parse(recoilPersist);
      if (!CurrentFloor || !CurrentSection) {
        navigator("/home");
      }
    } else {
      navigator("/home");
    }

    closeAll();
    resetTargetCabinetInfo();
    resetCurrentCabinetId();

    return () => {
      closeAll();
      resetTargetCabinetInfo();
      resetCurrentCabinetId();
    };
  }, []);

  const swipeSection = (touchEndPosX: number, touchEndPosY: number) => {
    const touchOffsetX = Math.round(touchEndPosX - touchStartPosX.current);
    const touchOffsetY = Math.round(touchEndPosY - touchStartPosY.current);

    if (
      Math.abs(touchOffsetX) < 50 ||
      Math.abs(touchOffsetX) < Math.abs(touchOffsetY)
    ) {
      return;
    }

    if (touchOffsetX > 0) {
      moveSectionTo("left");
    } else {
      moveSectionTo("right");
    }
  };

  const moveSectionTo = (direction: string) => {
    if (direction === "left") {
      setCurrentSectionName(
        currentSectionIndex <= 0
          ? sectionList[sectionList.length - 1]
          : sectionList[currentSectionIndex - 1]
      );
    } else if (direction === "right") {
      setCurrentSectionName(
        currentSectionIndex >= sectionList.length - 1
          ? sectionList[0]
          : sectionList[currentSectionIndex + 1]
      );
    }

    mainWrapperRef.current?.scrollTo(0, 0);
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
        <CabinetListWrapperStyled>
          <CabinetListContainer isAdmin={false} />
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

export default MainPage;
