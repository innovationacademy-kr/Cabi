import styled from "@emotion/styled";
import HomeButton from "../atoms/buttons/HomeButton";
import BuildingButton from "../atoms/buttons/BuildingButton";
import MenuButton from "../atoms/buttons/MenuButton";
// import FloorButton from "../atoms/buttons/FloorButton";
import QuestionButton from "../atoms/buttons/QustionButton";
import GuideModal from "../atoms/modals/GuideModal";
import GuideBox from "../atoms/modals/GuideBox";

const MainSection = styled.section`
  height: 90vh;
  width: 25rem;
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
  position: relative;
  bottom: 1rem;
`;
const CabinetTemplate = (): JSX.Element => {
  return (
    <MainSection>
      <MainNavSection>
        <HomeButton />
        <BuildingButton />
        <MenuButton />
      </MainNavSection>
      <MainCarouselSection>Carousel Section</MainCarouselSection>
      <MainQuestionSection>
        <GuideModal box={<GuideBox />} ModalButton={QuestionButton} />
      </MainQuestionSection>
    </MainSection>
  );
};

export default CabinetTemplate;
