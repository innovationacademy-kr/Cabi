import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import DetailTableContainer from "@/components/Presentation/Details/DetailTable.container";
import { MoveSectionButtonStyled } from "@/components/SectionPagination/SectionPagination";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

const DetailContent = ({
  moveMonth,
  currentDate,
  presentationDetailInfo,
  makeIDateObj,
  canMoveLeft,
  canMoveRight,
}: {
  moveMonth: (direction: string) => void;
  currentDate: IDate | null;
  presentationDetailInfo: IPresentationScheduleDetailInfo[] | null;
  makeIDateObj: (date: Date) => IDate;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}) => {
  return (
    <ContainerStyled>
      <HeaderStyled>
        {canMoveLeft ? (
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            onClick={() => moveMonth("left")}
            className="cabiButton"
          />
        ) : (
          <div id="replaceOfMoveButton"></div>
        )}
        <div id="headerDate">
          {currentDate?.year}년 {currentDate?.month}월
        </div>
        {canMoveRight ? (
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            onClick={() => moveMonth("right")}
            arrowReversed={true}
            className="cabiButton"
          />
        ) : (
          <div id="replaceOfMoveButton"></div>
        )}
      </HeaderStyled>
      <BodyStyled>
        <DetailTableContainer
          presentationDetailInfo={presentationDetailInfo}
          makeIDateObj={makeIDateObj}
        />
      </BodyStyled>
    </ContainerStyled>
  );
};

export default DetailContent;

const ContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
`;

const HeaderStyled = styled.div`
  margin-top: 70px;
  text-align: center;
  width: 340px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > #headerDate {
    width: 200px;
    height: 50px;
    font-size: 2rem;
    line-height: 3rem;
    font-weight: 600;
  }

  & > img {
    width: 2.5rem;
    height: 2.5rem;
  }

  & > #replaceOfMoveButton {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0px 15px;
  }

  @media (max-width: 1150px) {
    margin-top: 30px;
  }
`;

const BodyStyled = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  width: 80%;
  padding: 24px 20px 10px 20px;
  background-color: var(--lightgray-color);
  border-radius: 10px;
  display: flex;
  min-width: 375px;

  @media (max-width: 1150px) {
    margin-top: 16px;
    width: 96%;
    padding: 0 16px;
  }
`;
