import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentBuildingNameState,
  currentCabinetIdState,
  currentFloorNumberState,
  currentFloorSectionNamesState,
  currentSectionNameState,
  isCurrentSectionRenderState,
  targetCabinetInfoState,
} from "@/Cabinet/recoil/atoms";
import { currentFloorSectionState } from "@/Cabinet/recoil/selectors";
import { DISABLED_FLOOR } from "@/Cabinet/pages/AvailablePage";
import CabinetListContainer from "@/Cabinet/components/CabinetList/CabinetList.container";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import SectionAlertModal from "@/Cabinet/components/Modals/StoreModal/SectionAlertModal";
import SectionPaginationContainer from "@/Cabinet/components/SectionPagination/SectionPagination.container";
import { clubSectionsData } from "@/Cabinet/assets/data/mapPositionData";
import { ReactComponent as FilledHeartIcon } from "@/Cabinet/assets/images/filledHeart.svg";
import { ReactComponent as LineHeartIcon } from "@/Cabinet/assets/images/lineHeart.svg";
import { ICurrentSectionInfo } from "@/Cabinet/types/dto/cabinet.dto";
import SectionType from "@/Cabinet/types/enum/map.type.enum";
import useCabinetListRefresh from "@/Cabinet/hooks/useCabinetListRefresh";
import useMenu from "@/Cabinet/hooks/useMenu";

const MainPage = () => {
  const touchStartPosX = useRef(0);
  const touchStartPosY = useRef(0);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const { closeAll } = useMenu();
  const navigator = useNavigate();
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);
  const sectionList: Array<ICurrentSectionInfo> = useRecoilValue<
    Array<ICurrentSectionInfo>
  >(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentSectionIndex = sectionList.findIndex(
    (section) => section.sectionName === currentSectionName
  );
  const currentBuilding = useRecoilValue<string>(currentBuildingNameState);
  const currentFloor = useRecoilValue<number>(currentFloorNumberState);
  const { refreshCabinetList, isLoading } = useCabinetListRefresh(
    currentBuilding,
    currentFloor
  );
  const [isClubSection, setIsClubSection] = useState(false);
  const [showSectionAlertModal, setShowSectionAlertModal] =
    useState<boolean>(false);
  const [isCurrentSectionRender, setIsCurrentSectionRender] = useRecoilState(
    isCurrentSectionRenderState
  );
  const [currentFloorSectionNames] = useRecoilState(
    currentFloorSectionNamesState
  );

  useEffect(() => {
    if (!currentFloor) {
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

  useEffect(() => {
    const clubSection = !!clubSectionsData.find((section) => {
      return section === currentSectionName;
    });
    setIsClubSection(clubSection);
  }, [currentSectionName]);

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
          ? sectionList[sectionList.length - 1].sectionName
          : sectionList[currentSectionIndex - 1].sectionName
      );
    } else if (direction === "right") {
      setCurrentSectionName(
        currentSectionIndex >= sectionList.length - 1
          ? sectionList[0].sectionName
          : sectionList[currentSectionIndex + 1].sectionName
      );
    }

    mainWrapperRef.current?.scrollTo(0, 0);
  };

  const handleAlertIconBtn = () => {
    setShowSectionAlertModal(true);
    setIsCurrentSectionRender(false);
  };

  return isLoading ? (
    <LoadingAnimation />
  ) : (
    <WrapperStyled
      ref={mainWrapperRef}
      onTouchStart={(e: React.TouchEvent) => {
        touchStartPosX.current = e.changedTouches[0].screenX;
        touchStartPosY.current = e.changedTouches[0].screenY;
      }}
      onTouchEnd={(e: React.TouchEvent) => {
        swipeSection(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
      }}
    >
      <AlertStyled currentFloor={currentFloor}>
        {currentFloorSectionNames.includes(currentSectionName) &&
          !isClubSection && (
            <IconWrapperStyled
              onClick={handleAlertIconBtn}
              disabled={!!sectionList[currentSectionIndex]?.alarmRegistered}
            >
              {sectionList[currentSectionIndex]?.alarmRegistered === true ? (
                <FilledHeartIcon />
              ) : (
                <LineHeartIcon />
              )}
            </IconWrapperStyled>
          )}
      </AlertStyled>
      <SectionPaginationContainer />
      <CabinetListWrapperStyled>
        <CabinetListContainer isAdmin={false} />
        {currentSectionName !== SectionType.elevator &&
          currentSectionName !== SectionType.stairs && (
            <RefreshButtonStyled
              className="cabiButton"
              title="새로고침"
              id="refreshButton"
              onClick={refreshCabinetList}
            >
              새로고침
            </RefreshButtonStyled>
          )}
      </CabinetListWrapperStyled>
      {showSectionAlertModal && (
        <SectionAlertModal
          currentSectionName={currentSectionName}
          setShowSectionAlertModal={setShowSectionAlertModal}
          currentBuilding={currentBuilding}
          currentFloor={currentFloor}
        />
      )}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
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
  font-size: 1rem;
  border-radius: 30px;
  margin: 30px;
  color: var(--white-text-with-bg-color);
  @media (max-height: 745px) {
    margin-bottom: 8px;
  }
`;

const IconWrapperStyled = styled.div<{ disabled: boolean }>`
  height: 16px;
  width: 16px;
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};

  &:hover {
    cursor: pointer;
  }
`;

const AlertStyled = styled.div<{ currentFloor: number }>`
  visibility: ${(props) =>
    DISABLED_FLOOR.includes(props.currentFloor.toString())
      ? "hidden"
      : "visible"};
  height: 30px;
  display: flex;
  justify-content: end;
  align-items: end;
  padding-right: 14px;
`;

export default MainPage;
