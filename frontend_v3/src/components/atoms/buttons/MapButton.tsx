import React from "react";
import styled from "@emotion/styled";

type ButtonProps = {
  x: number;
  y: number;
  widthRate: number;
  heightRate: number;
  isSection: boolean;
};

const Button = styled.button<ButtonProps>`
  display: flex;
  font-size: 0.8rem;
  justify-content: center;
  align-items: center;
  grid-column-start: ${(props): string => `${props.x + 1}`};
  grid-column-end: ${(props): string => `${props.widthRate + props.x + 1}`};
  grid-row-start: ${(props): string => `${props.y + 1}`};
  grid-row-end: ${(props): string => `${props.heightRate + props.y + 1}`};
  border-radius: 0.5rem;
  background-color: ${(props): string =>
    props.isSection ? "#a3a4ce" : "#c0c0c0"};
  padding: 0;
  margin: 0;
  white-space: normal;
  word-break: break-all;
`;

interface MapButtonProps {
  positionX: number;
  positionY: number;
  widthRate: number;
  heightRate: number;
  sectionName: string;
  sectionSlide: number | null;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>> | null;
}

const MapButton = (props: MapButtonProps): JSX.Element => {
  const {
    positionX,
    positionY,
    widthRate,
    heightRate,
    sectionName,
    sectionSlide,
    setCurrentSlide,
  } = props;

  const handleClick = (): void => {
    if (sectionSlide && setCurrentSlide) {
      setCurrentSlide(sectionSlide);
    }
  };

  return (
    <Button
      x={positionX}
      y={positionY}
      widthRate={widthRate}
      heightRate={heightRate}
      isSection={sectionName !== "E/V"}
      onClick={(): void => handleClick()}
    >
      {sectionName}
    </Button>
  );
};

export default MapButton;
