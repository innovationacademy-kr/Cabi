import { useEffect, useState } from "react";
import styled from "styled-components";
import { MoveSectionButtonStyled } from "@/components/SectionPagination/SectionPagination";
import DetailTable from "@/components/Wednesday/Detail/DetailTable";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";

interface IDate {
  year: number;
  month: number;
  day: number;
}

const DetailPage = () => {
  const [currentDate, setCurrentDate] = useState({
    year: 0,
    month: 0,
    day: 0,
  });
  // 오늘날짜 useState?

  let date = { year: 2023, month: 12, day: 31 };
  // TODO : axios로 현재 페이지의 날짜를 받는다

  useEffect(() => {
    setCurrentDate(date);
    // axios로 받은 현재 페이지의 날짜로 띄워줄거 세팅
  }, []);

  const Move = (direction: string) => {
    let requestDate: IDate = { ...currentDate };

    if (direction === "left") {
      // 현재 페이지 날짜의 월-1 axios 요청
      if (currentDate.month === 1) {
        requestDate.year = currentDate.year - 1;
        requestDate.month = 12;
      } else {
        requestDate.month = currentDate.month - 1;
      }
    } else {
      if (currentDate.month === 12) {
        requestDate.year = currentDate.year + 1;
        requestDate.month = 1;
      } else {
        requestDate.month = currentDate.month + 1;
      }
    }
    // TODO : axios requestDate
    // 성공시
    // 실패시
    setCurrentDate(requestDate);
  };

  return (
    <ContainerStyled>
      <WrapperStyled>
        <HeaderStyled>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            onClick={() => Move("left")}
            className="cabiButton"
          />
          <div>
            {currentDate.year}년 {currentDate.month}월
          </div>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            onClick={() => Move("right")}
            arrowReversed={true}
            className="cabiButton"
          />
        </HeaderStyled>
        <BodyStyled>
          <DetailTable />
        </BodyStyled>
      </WrapperStyled>
    </ContainerStyled>
  );
};

export default DetailPage;

const ContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  @media screen and (max-width: 768px) {
    background-color: var(--lightgray-color);
  }
`;

const WrapperStyled = styled.div`
  width: 80%;
  margin-top: 70px;
`;

const HeaderStyled = styled.div`
  text-align: center;
  width: 100%;
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
  margin-bottom: 70px;
  width: 100%;
  padding: 24px 20px 10px 20px;
  background-color: var(--lightgray-color);
  border-radius: 10px;
  /* @media screen and (max-width: 700px) {
    width: 100%;
    background-color: red;
    display: flex;
    flex-direction: column;
    display:block;} */
`;
