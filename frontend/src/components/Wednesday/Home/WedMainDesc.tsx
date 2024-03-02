import styled from "styled-components";
import { IDate } from "@/pages/Wednesday/DetailPage";
import { presentationPeriodNumber } from "../Details/DetailTableBodyRow";
import { IPresentation } from "./RecentPresentation";

const WedMainDesc = ({
  selectedPresentation,
  selectedDate,
}: {
  selectedPresentation: IPresentation | null;
  selectedDate: IDate | null;
}) => {
  return (
    <WedSummaryStyled>
      <SummaryHeaderStyled>
        <TitleStyled>
          {selectedDate?.month}월 {selectedDate?.day}일 오후 1시
        </TitleStyled>
        <PlaceStyled>지하 1층</PlaceStyled>
        <TimerStyled>
          <ImageStyled>
            <img src="/src/assets/images/timer.svg" alt="" />
          </ImageStyled>
          <span>
            {presentationPeriodNumber[selectedPresentation?.presentationTime!]}
          </span>
        </TimerStyled>
      </SummaryHeaderStyled>

      <SummaryDetailStyled>{selectedPresentation?.detail}</SummaryDetailStyled>
    </WedSummaryStyled>
  );
};

export default WedMainDesc;

const WedSummaryStyled = styled.div`
  @media (max-width: 465px) {
    padding: 30px 30px 30px 30px;
  }
  margin-bottom: 30px;
  background-color: #2c49b1;
  width: 80%;
  max-width: 1100px;
  // min-height: 300px;
  border-radius: 30px;
  margin-top: 50px;
  padding: 50px 50px 50px 50px;
`;

const SummaryHeaderStyled = styled.div`
  display: flex;
  align-items: flex-end;
  color: #fff;
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
`;

const ImageStyled = styled.div`
  margin-right: 15px;
  height: 15px;
`;

const SummaryDetailStyled = styled.div`
  color: #fff;
  text-shadow: 0px 3px 5px black;
  word-break: break-all;
`;
