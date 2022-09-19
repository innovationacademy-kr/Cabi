import React from "react";
import styled from "@emotion/styled";

const SlideButtonComponent = styled.button`
  width: 70px;
  height: 20px;
  border: 1px solid blue;
  padding: 0;
`;

interface SlideButtonProps {
  direction: string;
  lastSlide: number;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

const SlideButton = (props: SlideButtonProps): JSX.Element => {
  const { direction, lastSlide, currentSlide, setCurrentSlide } = props;
  const clickHandler = (): void => {
    if (direction === "left") {
      if (currentSlide === 0) setCurrentSlide(lastSlide);
      else setCurrentSlide(currentSlide - 1);
    } else if (currentSlide === lastSlide) setCurrentSlide(0);
    else setCurrentSlide(currentSlide + 1);
  };
  return (
    <div>
      {direction === "left" ? (
        <SlideButtonComponent onClick={clickHandler}>LEFT</SlideButtonComponent>
      ) : (
        <SlideButtonComponent onClick={clickHandler}>
          RIGHT
        </SlideButtonComponent>
      )}
    </div>
  );
};

export default SlideButton;
