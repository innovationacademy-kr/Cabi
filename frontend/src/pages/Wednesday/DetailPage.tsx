import { useEffect, useState } from "react";
import styled from "styled-components";
import { MoveSectionButtonStyled } from "@/components/SectionPagination/SectionPagination";
import DetailTable from "@/components/Wednesday/Details/DetailTable";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";
import { axiosGetPresentationSchedule } from "@/api/axios/axios.custom";

interface IDate {
  year: string;
  month: string;
  day: string;
}

const DetailPage = () => {
  const [currentDate, setCurrentDate] = useState({
    year: "",
    month: "",
    day: "",
  });
  const [todayDate, setTodayDate] = useState({
    year: "",
    month: "",
    day: "",
  });

  // TODO : 오늘 날짜 recoil로 있으면 좋을듯
  useEffect(() => {
    const date = new Date();
    let dateISO = date.toISOString();
    // 1. T 앞에서 끊고
    let dateBeforeT = dateISO.substring(0, 10);

    // 2. -로 분리
    let dateSplited = dateBeforeT.split("-");

    const todayDateObj = {
      year: dateSplited[0],
      month: dateSplited[1],
      day: dateSplited[2],
    };

    // year, month, day 다 같으면 갈아끼우지말기
    setCurrentDate(todayDateObj);
    if (
      !(
        todayDate.year === todayDateObj.year ||
        todayDate.month === todayDateObj.month ||
        todayDate.day === todayDateObj.day
      )
    ) {
      setTodayDate(todayDateObj);
    }
  }, []);

  useEffect(() => {
    getPresentationSchedule(todayDate);
  }, [currentDate]);

  const getPresentationSchedule = async (requestDate: IDate) => {
    try {
      const response = await axiosGetPresentationSchedule(
        requestDate.year + requestDate.month
      );
      // setMyInfo({ ...myInfo, cabinetId: currentCabinetId });
      // setIsCurrentSectionRender(true);
    } catch (error: any) {
    } finally {
    }
  };

  const moveMonth = (direction: string) => {
    let requestDate: IDate = { ...currentDate };
    let currentDateMonth = parseInt(currentDate.month);
    let currentDateYear = parseInt(currentDate.year);

    if (direction === "left") {
      // 현재 페이지 날짜의 월-1 axios 요청
      if (currentDateMonth === 1) {
        requestDate.year = (currentDateYear - 1).toString();
        requestDate.month = (12).toString();
      } else {
        requestDate.month = (currentDateMonth - 1).toString().padStart(2, "0");
      }
    } else {
      if (currentDateMonth === 12) {
        requestDate.year = (currentDateYear + 1).toString();
        requestDate.month = (1).toString();
      } else {
        requestDate.month = (currentDateMonth + 1).toString().padStart(2, "0");
      }
    }

    setCurrentDate(requestDate);
  };

  return (
    <ContainerStyled>
      <WrapperStyled>
        <HeaderStyled>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            onClick={() => moveMonth("left")}
            className="cabiButton"
          />
          <div>
            {currentDate.year}년 {currentDate.month}월
          </div>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            onClick={() => moveMonth("right")}
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
