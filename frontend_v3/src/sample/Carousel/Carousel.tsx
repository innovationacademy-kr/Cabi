import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import SlideContainer from "./SlideContainer";
import ButtonArea from "./ButtonArea";

const CarouselComponent = styled.div`
  width: 150px;
  margin: auto;
  overflow: hidden;
`;

const Carousel = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLInputElement>(null);
  const lastSlide = 2;

  useEffect(() => {
    if (slideRef.current != null) {
      slideRef.current.style.transition = "all 0.5s ease-in-out";
      slideRef.current.style.transform = `translateX(-${
        (currentSlide * 100) / (lastSlide + 1)
      }%)`; // 백틱을 사용하여 슬라이드로 이동하는 에니메이션을 만듭니다.
    }
  }, [currentSlide]);

  return (
    <CarouselComponent>
      <SlideContainer slideRef={slideRef} />
      <ButtonArea
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        lastSlide={lastSlide}
      />
    </CarouselComponent>
  );
};

export default Carousel;
