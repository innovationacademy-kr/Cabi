import { useEffect, useRef, useState } from "react";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import styled from "styled-components";
import {
  currentBuildingNameState,
  currentFloorCabinetState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/recoil/atoms";
import { currentCabinetIdState, targetCabinetInfoState } from "@/recoil/atoms";
import { currentFloorSectionState } from "@/recoil/selectors";
import CabinetListContainer from "@/components/CabinetList/CabinetList.container";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import SectionPaginationContainer from "@/components/SectionPagination/SectionPagination.container";
import { CabinetInfoByBuildingFloorDto } from "@/types/dto/cabinet.dto";
import { axiosCabinetByBuildingFloor } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

const MainPage = () => {
  const touchStartPosX = useRef(0);
  const touchStartPosY = useRef(0);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const { closeAll } = useMenu();

  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);

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
  const currentSectionIndex = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentBuilding = useRecoilValue<string>(currentBuildingNameState);
  const [currentFloor, setCurrentFloor] = useRecoilState<number>(
    currentFloorNumberState
  );
  const setCurrentFloorData = useSetRecoilState<
    CabinetInfoByBuildingFloorDto[]
  >(currentFloorCabinetState);
  const setCurrentSection = useSetRecoilState<string>(currentSectionNameState);

  const refreshCabinetList = async () => {
    setIsLoading(true);
    try {
      await axiosCabinetByBuildingFloor(currentBuilding, currentFloor)
        .then((response) => {
          setCurrentFloorData(response.data);
          const sections = response.data.map(
            (data: CabinetInfoByBuildingFloorDto) => data.section
          );
          let currentSectionFromPersist = undefined;
          const recoilPersist = localStorage.getItem("recoil-persist");
          if (recoilPersist) {
            const recoilPersistObj = JSON.parse(recoilPersist);
            if (Object.keys(recoilPersistObj).includes("CurrentSection")) {
              currentSectionFromPersist = recoilPersistObj.CurrentSection;
            }
          }
          currentSectionFromPersist &&
          sections.includes(currentSectionFromPersist)
            ? setCurrentSection(currentSectionFromPersist)
            : setCurrentSection(response.data[0].section);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {});
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

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
            disable={false}
          >
            <ImgStyled
              w="20px"
              h="20px"
              src="/src/assets/images/refreshIcon.svg"
              alt="새로고침 버튼"
            />
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

const RefreshButtonStyled = styled.div<{
  disable?: boolean;
}>`
  width: 32px;
  height: 32px;
  margin: 20px 0 0 20px;
  cursor: pointer;
  display: ${({ disable }) => (disable ? "none" : "block")};
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
    }
  }
`;

const ImgStyled = styled.img<{ w?: string; h?: string }>`
  width: ${({ w }) => (w ? w : "100%")};
  height: ${({ h }) => (h ? h : "100%")};
`;

export default MainPage;
