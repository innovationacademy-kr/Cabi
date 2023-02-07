import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { currentFloorSectionState } from "@/recoil/selectors";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { currentSectionNameState, isMultiSelectState } from "@/recoil/atoms";
import { currentCabinetIdState, targetCabinetInfoState } from "@/recoil/atoms";
import useMenu from "@/hooks/useMenu";
import SectionPaginationContainer from "@/components/SectionPagination/SectionPagination.container";
import CabinetListContainer from "@/components/CabinetList/CabinetList.container";
import MultiSelectButton from "@/components/Common/MultiSelectButton";

const MainPage = () => {
  const touchStartPosX = useRef(0);
  const touchStartPosY = useRef(0);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const { closeAll } = useMenu();

  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);
  const [isMultiSelect, setIsMultiSelect] =
    useRecoilState<boolean>(isMultiSelectState);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
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

  const handleOnClickMultiSelect = () => {
    closeAll();
    setIsMultiSelect(!isMultiSelect);
  };

  const handleSelectAllBtnOnClick = () => {
    setIsSelectAll(!isSelectAll);
    // todo: 전체 선택 버튼 누를 시 targetCabinetInfoList에 현재 섹션 캐비넷 전부 append
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
      <MultiSelectButton
        theme={isMultiSelect ? "fill" : "line"}
        text="다중 선택 모드"
        onClick={handleOnClickMultiSelect}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SelectAllBtnContainerStyled
          isVisible={isMultiSelect}
          onClick={handleSelectAllBtnOnClick}
        >
          <SelectAllIconStyled
            src={
              isSelectAll
                ? "/src/assets/images/selectAllIconOn.svg"
                : "/src/assets/images/selectAllIconOff.svg"
            }
            alt=""
            isVisible={isMultiSelect}
            isClicked={isSelectAll}
          />
          <SelectAllBtnStyled isClicked={isSelectAll}>
            전체 선택
          </SelectAllBtnStyled>
        </SelectAllBtnContainerStyled>
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

const SelectAllBtnContainerStyled = styled.div<{
  isVisible: boolean;
}>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  justify-content: center;
  margin-top: 4px;
`;

const SelectAllIconStyled = styled.img<{
  isVisible: boolean;
  isClicked: boolean;
}>`
  width: 24px;
  height: 24px;
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
`;

const SelectAllBtnStyled = styled.button<{
  isClicked: boolean;
}>`
  border: none;
  background-color: transparent;
  width: 100%;
  height: 18px;
  font-size: 16px;
  color: ${({ isClicked }) =>
    isClicked ? "var(--main-color)" : "var(--line-color)"};
  padding: 0 0 0 2px;
`;

const CabinetListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
`;
export default MainPage;
