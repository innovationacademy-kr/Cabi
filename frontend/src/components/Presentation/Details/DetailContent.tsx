import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import DetailTableContainer from "@/components/Presentation/Details/DetailTable.container";
import { MoveSectionButtonStyled } from "@/components/SectionPagination/SectionPagination";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";

const DetailContent = ({
  moveMonth,
  currentDate,
  presentationDetailInfo,
  makeIDateObj,
}: {
  moveMonth: (direction: string) => void;
  currentDate: IDate | null;
  presentationDetailInfo: IPresentationScheduleDetailInfo[] | null;
  makeIDateObj: (date: Date) => IDate;
}) => {
  return (
    <ContainerStyled>
      <HeaderStyled>
        <MoveSectionButtonStyled
          src={LeftSectionButton}
          onClick={() => moveMonth("left")}
          className="cabiButton"
        />
        <div>
          {currentDate?.year}년 {currentDate?.month}월
        </div>
        <MoveSectionButtonStyled
          src={LeftSectionButton}
          onClick={() => moveMonth("right")}
          arrowReversed={true}
          className="cabiButton"
        />
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

  @media screen and (max-width: 1150px) {
    background-color: var(--lightgray-color);
  }
`;

const HeaderStyled = styled.div`
  margin-top: 70px;
  text-align: center;
  width: 340px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
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
`;

const BodyStyled = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  width: 80%;
  padding: 24px 20px 10px 20px;
  background-color: var(--lightgray-color);
  border-radius: 10px;
  display: flex;

  @media screen and (max-width: 1150px) {
    margin-top: 0px;
    width: 100%;
  }
`;
