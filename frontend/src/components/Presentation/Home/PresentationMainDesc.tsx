import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import { PresentationPeriodTypeLabelMap } from "@/assets/data/Presentation/maps";
import { IPresentationInfo } from "@/types/dto/presentation.dto";

const PresentationCardDetail = ({
  selectedPresentation,
  selectedDate,
}: {
  selectedPresentation: IPresentationInfo | null;
  selectedDate: IDate | null;
}) => {
  return (
    <ContainerStyled>
      <HeaderStyled>
        <TitleStyled>
          {selectedDate?.month}월 {selectedDate?.day}일 오후 1시
        </TitleStyled>
        <PlaceStyled>지하 1층</PlaceStyled>
        <TimerStyled>
          <ImageStyled>
            <img src="/src/assets/images/timer.svg" alt="" />
          </ImageStyled>
          <span>
            {
              PresentationPeriodTypeLabelMap[
                selectedPresentation?.presentationTime!
              ]
            }
          </span>
        </TimerStyled>
      </HeaderStyled>

      <DetailStyled>{selectedPresentation?.detail}</DetailStyled>
    </ContainerStyled>
  );
};

export default PresentationCardDetail;

const ContainerStyled = styled.div`
  @media (max-width: 465px) {
    padding: 30px 30px 30px 30px;
  }
  margin-bottom: 30px;
  // background-color: #2c49b1;
  // background-color: #3f69fd;
  background-color: #90b5f9;
  // background-color: #f5f5f5;
  width: 80%;
  max-width: 1100px;
  border-radius: 30px;
  margin-top: 50px;
  padding: 50px 50px 50px 50px;
`;

const HeaderStyled = styled.div`
  display: flex;
  align-items: flex-end;
  color: #000;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const TitleStyled = styled.div`
  margin-right: 30px;
  @media (max-width: 465px) {
    font-size: 2rem;
  }
`;

const PlaceStyled = styled.div`
  font-size: 2rem;
  margin-top: 10px;
  @media (max-width: 465px) {
    font-size: 1.5rem;
  }
  margin-right: 30px;
  display: inline-block;
`;

const TimerStyled = styled.div`
  display: flex;
  align-items: flex-end;
  height: 18px;
  font-size: 1rem;
  font-weight: 400;
  margin-top: 10px;
  color: #fff;

  & > span {
    color: #000;
  }
`;

const ImageStyled = styled.div`
  margin-right: 15px;
  height: 15px;
  color: #000;
`;

const DetailStyled = styled.div`
  background-color: #fff;
  padding: 30px 50px;
  border-radius: 10px;
  word-break: break-all;
`;
