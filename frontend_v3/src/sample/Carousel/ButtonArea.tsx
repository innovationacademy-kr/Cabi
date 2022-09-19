import React from "react";
import styled from "@emotion/styled";
import SlideButton from "./SlideButton";

const ButtonAreaComponent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
`;

interface ButtonAreaProps {
  lastSlide: number;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

const ButtonArea = (props: ButtonAreaProps): JSX.Element => {
  const { lastSlide, currentSlide, setCurrentSlide } = props;
  return (
    <ButtonAreaComponent>
      <SlideButton
        direction="left"
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        lastSlide={lastSlide}
      />
      <SlideButton
        direction="right"
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        lastSlide={lastSlide}
      />
    </ButtonAreaComponent>
  );
};

export default ButtonArea;
