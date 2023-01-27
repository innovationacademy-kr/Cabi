import { useState } from "react";
import styled from "styled-components";
import { currentFloorSectionState } from "@/recoil/selectors";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentSectionNameState } from "@/recoil/atoms";
import SectionPaginationContainer from "@/components/SectionPagination/SectionPagination.container";
import CabinetListContainer from "@/components/CabinetList/CabinetList.container";

const MainPage = () => {
  // let touchStartPosX: number;
  const [touchStartPosX, setTouchStartPosX] = useState<number>(-1);
  const [touchStartPosY, setTouchStartPosY] = useState<number>(-1);
  const sectionList = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );

  const currentSectionIdx = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );

  const moveToLeftSection = () => {
    if (currentSectionIdx <= 0) {
      setCurrentSectionName(sectionList[sectionList.length - 1]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx - 1]);
    }
  };

  const moveToRightSection = () => {
    if (currentSectionIdx >= sectionList.length - 1) {
      setCurrentSectionName(sectionList[0]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx + 1]);
    }
  };

  const swipeSection = (touchEndPosX: number, touchEndPosY: number) => {
    const touchOffsetX = Math.round(touchEndPosX - touchStartPosX);
    const touchOffsetY = Math.round(touchEndPosY - touchStartPosY);

    if (Math.abs(touchOffsetX) < 100 || Math.abs(touchOffsetY) > 100) return;
    if (touchEndPosX > touchStartPosX) moveToLeftSection();
    else moveToRightSection();
  };

  return (
    <WapperStyled
      onTouchStart={(e: React.TouchEvent) => {
        setTouchStartPosX(e.changedTouches[0].screenX);
        setTouchStartPosY(e.changedTouches[0].screenY);
      }}
      onTouchEnd={(e: React.TouchEvent) =>
        swipeSection(e.changedTouches[0].screenX, e.changedTouches[0].screenY)
      }
    >
      <SectionPaginationContainer />
      <CabinetListWrapperStyled>
        <CabinetListContainer />
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
