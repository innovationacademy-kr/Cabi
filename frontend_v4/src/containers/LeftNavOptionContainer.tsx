import React from "react";
import styled from "styled-components";
import CabinetColorTable from "@/components/CabinetColorTable";

const floorSection = [
  "End of Cluster1",
  "Cluster 1 - OA",
  "Cluster 1 - Terrace",
  "Oasis",
  "End of Cluster 2",
];

const LeftNavOptionContainer = (props: { style?: React.CSSProperties }) => {
  return (
    <LeftNavOptionStyled style={props.style}>
      {floorSection.map((section: string, index: number) => (
        <FloorSectionStyled key={index}>{section}</FloorSectionStyled>
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
  cursor: pointer;
  &:hover {
    background-color: var(--main-color);
    color: var(--white);
  }
`;

export default LeftNavOptionContainer;
