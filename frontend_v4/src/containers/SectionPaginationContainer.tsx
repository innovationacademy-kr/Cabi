import React, { useState } from "react";
import styled from "styled-components";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";

export const SectionPaginationContainer = () => {
  /* 
    require props 
    1. Current floor
    1. Section list
    2. Current section name
    3. Current section index
    */
  const floor = 2;
  const sectionList = [
    "End of Cluster1",
    "Cluster1 - OA",
    "Cluster1 - Terrace",
    "Oasis",
    "End of Cluster2",
  ];
  const sectionCount = sectionList.length;

  const [currentSectionIdx, setCurrentSectionIdx] = useState<number>(0);
  const currentSectionName = sectionList.at(currentSectionIdx);
  const currentPositionName = floor.toString() + "층 - " + currentSectionName;

  const paginationIdxBar = sectionList.map((sectionName, idx) => (
    <IndexRectangleStyled
      key={sectionName}
      bgColor={sectionName === currentSectionName ? "#9747FF" : "#D9D9D9"}
      onClick={() => setCurrentSectionIdx(idx)}
    />
  ));

  const moveToLeftSection = () => {
    if (currentSectionIdx == 0) return setCurrentSectionIdx(sectionCount - 1);
    setCurrentSectionIdx(currentSectionIdx - 1);
  };

  const moveToRightSection = () => {
    if (currentSectionIdx == sectionCount - 1) return setCurrentSectionIdx(0);
    setCurrentSectionIdx(currentSectionIdx + 1);
  };

  return (
    <SectionPaginationStyled>
      <SectionBarStyled>
        <MoveSectionButtonStyled
          src={LeftSectionButton}
          onClick={moveToLeftSection}
        />
        <SectionNameTextStyled>{currentPositionName}</SectionNameTextStyled>
        <MoveSectionButtonStyled
          src={LeftSectionButton}
          needRotate
          onClick={moveToRightSection}
        />
      </SectionBarStyled>
      <SectionIndexStyled>{paginationIdxBar}</SectionIndexStyled>
    </SectionPaginationStyled>
  );
};

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
