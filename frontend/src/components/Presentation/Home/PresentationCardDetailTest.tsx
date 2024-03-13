import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import { IPresentationInfo } from "@/types/dto/presentation.dto";

const PresentationCardDetailTest = ({
  selectedPresentation,
  selectedDate,
}: {
  selectedPresentation: IPresentationInfo | null;
  selectedDate: IDate | null;
}) => {
  return (
    <ContainerStyled>
      <TitleStyled>
        <p>
          {selectedDate?.month}월 {selectedDate?.day}일 오후 1시
        </p>
        <p>지하 1층</p>
      </TitleStyled>
      <DetailStyled>{selectedPresentation?.detail}</DetailStyled>
    </ContainerStyled>
  );
};

export default PresentationCardDetailTest;

const ContainerStyled = styled.div`
  position: absolute;
  z-index: 3;
  transform: translateY(0px);
  transition: all 0.5s;
  opacity: 0;

  top: 0px;
  left: 0px;
  &:hover {
    opacity: 0.9;
    transform: translateY(0px);
  }

  margin-bottom: 30px;
  //   background-color: #90b5f9;
  background: linear-gradient(#fff, #6296ff);
  width: 300px;
  min-height: 500px;
  border-radius: 30px;
  padding: 40px 30px 20px 30px;
  box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const TitleStyled = styled.div`
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 1.5rem;
  width: 240px;
`;

const DetailStyled = styled.div`
  //   background-color: #fff;
  width: 240px;
  //   padding: 30px 50px;
  border-radius: 10px;
  word-break: break-all;
`;
