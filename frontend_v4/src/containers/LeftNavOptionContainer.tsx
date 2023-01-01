import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { currentFloorSectionState } from "@/recoil/selectors";
import styled from "styled-components";
import CabinetColorTable from "@/components/CabinetColorTable";
import { currentSectionNameState, toggleNavState } from "@/recoil/atoms";
import useLeftNav from "@/hooks/useLeftNav";

// const floorSection = [
//   "End of Cluster1",
//   "Cluster 1 - OA",
//   "Cluster 1 - Terrace",
//   "Oasis",
//   "End of Cluster 2",
// ];

const LeftNavOptionContainer = (props: { style?: React.CSSProperties }) => {
  const floorSection = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentFloorSection, setCurrentFloorSection] = useRecoilState<string>(
    currentSectionNameState
  );

  const { closeLeftNav } = useLeftNav();

  const onClickSection = (section: string) => {
    closeLeftNav();
    setCurrentFloorSection(section);
  };

  return (
    <LeftNavOptionStyled style={props.style}>
      {floorSection.map((section: string, index: number) => (
        <FloorSectionStyled
          className={
            currentFloorSection === section ? "leftNavButtonActive" : ""
          }
          key={index}
          onClick={() => onClickSection(section)}
        >
          {section}
        </FloorSectionStyled>
      ))}
      <CabinetColorTable />
    </LeftNavOptionStyled>
  );
};

const LeftNavOptionStyled = styled.div`
  min-width: 240px;
  height: 100%;
  padding: 32px 10px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  position: relative;
`;

const FloorSectionStyled = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  text-indent: 20px;
  color: var(--gray-color);
  margin: 2px 0;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    background-color: var(--main-color);
    color: var(--white);
  }
`;

export default LeftNavOptionContainer;
