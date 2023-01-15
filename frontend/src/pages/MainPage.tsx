import { useRef, useState } from "react";
import styled from "styled-components";
import { currentFloorSectionState } from "@/recoil/selectors";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentSectionNameState } from "@/recoil/atoms";
import SectionPaginationContainer from "@/components/SectionPagination/SectionPagination.container";
import CabinetListContainer from "@/components/CabinetList/CabinetList.container";

const MainPage = () => {
  const [touchOffset, setTouchOffset] = useState(0);
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

  const swipeSection = (last: number) => {
    const swipeDistance = Math.round(last - touchOffset);
    if (Math.abs(swipeDistance) < 50) return;
    if (last > touchOffset) moveToLeftSection();
    else moveToRightSection();
  };

  return (
    <WapperStyled
      onTouchStart={(e: React.TouchEvent) =>
        setTouchOffset(e.changedTouches[0].screenX)
      }
      onTouchEnd={(e: React.TouchEvent) =>
        swipeSection(e.changedTouches[0].screenX)
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
