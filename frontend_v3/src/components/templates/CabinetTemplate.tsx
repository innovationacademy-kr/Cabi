import React from "react";
import styled from "@emotion/styled";
import HomeButton from "../atoms/buttons/HomeButton";
import BuildingButton from "../atoms/buttons/BuildingButton";
import MenuButton from "../atoms/buttons/MenuButton";
// import FloorButton from "../atoms/buttons/FloorButton";
import QuestionButton from "../atoms/buttons/QustionButton";
import Carousel from "../organisms/Carousel";

const MainSection = styled.section`
  height: 100%;
  width: 100%;
  background-color: #ffffffec;
  border-radius: 1rem;
  Button {
    color: #333;
  }
`;

const MainNavSection = styled.div`
  display: flex;
  justify-content: space-between;
  height: 5%;
  padding: 0.5rem 0.7rem 0 0.7rem;
`;
const MainCarouselSection = styled.div`
  color: #333;
  height: 90%;
`;
const MainQuestionSection = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 5%;
  padding: 0 0.7rem;
`;

// TODO: hybae
// slide 개수를 건물, 층에 따라 계산하여 Carousel의 인자로 넘겨줘야 함.

const CabinetTemplate = (): JSX.Element => {
  return (
    <MainSection>
      <MainNavSection>
        <HomeButton />
        <BuildingButton />
        <MenuButton />
      </MainNavSection>
      <MainCarouselSection>
        <Carousel slideCount={3} />
      </MainCarouselSection>
      <MainQuestionSection>
        <QuestionButton />
      </MainQuestionSection>
    </MainSection>
  );
};

export default CabinetTemplate;
