import { useRecoilValue, useRecoilState } from "recoil";
import {
  currentFloorNumberState,
  currentSectionNameState,
} from "@/recoil/atoms";
import { currentFloorSectionState } from "@/recoil/selectors";
import SectionPaginationContainer from "@/containers/SectionPaginationContainer";
import styled from "styled-components";

const SectionPagination = (): JSX.Element => {
  const floor = useRecoilValue<number>(currentFloorNumberState);
  const sectionList = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentSectionIdx = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );
  const currentPositionName = floor?.toString() + "층 - " + currentSectionName;

  const changeSectionOnClickIdxButton = (idx: number) => {
    if (sectionList === undefined) return;

    const targetSectionName = sectionList.at(idx);
    if (targetSectionName === undefined) return;
    setCurrentSectionName(targetSectionName);
  };

  const moveToLeftSection = () => {
    if (currentSectionIdx == 0) {
      setCurrentSectionName(sectionList[sectionList.length - 1]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx - 1]);
    }
  };

  const moveToRightSection = () => {
    if (currentSectionIdx == sectionList.length - 1) {
      setCurrentSectionName(sectionList[0]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx + 1]);
    }
  };

  const isLoaded = floor !== undefined && sectionList !== undefined;
  if (isLoaded === false) return <></>;

  return (
    <SectionPaginationContainer
      currentSectionName={currentSectionName}
      currentPositionName={currentPositionName}
      sectionList={sectionList}
      changeSectionOnClickIdxButton={changeSectionOnClickIdxButton}
      moveToLeftSection={moveToLeftSection}
      moveToRightSection={moveToRightSection}
    />
  );
};

export default SectionPagination;

const SectionPaginationStyled = styled.div`
  min-width: 360px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionBarStyled = styled.div`
  margin: 10px 5%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MoveSectionButtonStyled = styled.img<{ needRotate?: boolean }>`
  width: 24px;
  height: 24px;
  margin: 0px 15px;
  opacity: 70%;
  cursor: pointer;
  transform: rotate(${(props) => (props.needRotate ? "180deg" : "0")});
  transition: all 0.2s;
  &:hover {
    opacity: 100%;
    transform: rotate(${(props) => (props.needRotate ? "180deg" : "0")})
      scale(1.3);
  }
`;

const SectionNameTextStyled = styled.div`
  min-width: 220px;
  font-size: 1rem;
  text-align: center;
  color: var(--gray-color);
`;

const SectionIndexStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const IndexRectangleStyled = styled.div<{ bgColor: string }>`
  width: 15px;
  height: 8px;
  border-radius: 2px;
  margin: 0px 3px;
  background: ${(props) => props.bgColor};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.3);
    background-color: var(--lightpurple-color);
  }
`;
