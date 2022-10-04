import React from "react";
import styled from "@emotion/styled";
import MapButton from "../atoms/buttons/MapButton";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 270px;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: #dee2e6;
`;

interface SectionMapProps {
  sections: string[];
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

const SectionMap = (props: SectionMapProps): JSX.Element => {
  const { sections, setCurrentSlide } = props;

  const gridInfo: Array<number[]> =
    sections.length === 5
      ? [
          [3, 7, 2, 1],
          [3, 5, 2, 1],
          [0, 5, 1, 3],
          [0, 2, 2, 1],
          [0, 0, 2, 1],
        ]
      : [
          [3, 7, 2, 1],
          [3, 5, 2, 1],
          [0, 2, 2, 1],
          [0, 0, 2, 1],
        ];

  const renderSections = (): JSX.Element[] => {
    return sections.map((section: string, i: number): JSX.Element => {
      return (
        <MapButton
          key={i}
          sectionName={section}
          positionX={gridInfo[i][0]}
          positionY={gridInfo[i][1]}
          widthRate={gridInfo[i][2]}
          heightRate={gridInfo[i][3]}
          sectionSlide={i + 1}
          setCurrentSlide={setCurrentSlide}
        />
      );
    });
  };
  return (
    <GridContainer>
      {renderSections()}
      <MapButton
        sectionName="E/V"
        positionX={0}
        positionY={3}
        widthRate={1}
        heightRate={1}
        sectionSlide={null}
        setCurrentSlide={null}
      />
    </GridContainer>
  );
};

export default SectionMap;
