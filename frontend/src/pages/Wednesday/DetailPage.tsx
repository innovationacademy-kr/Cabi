import { useEffect, useState } from "react";
import styled from "styled-components";
import { MoveSectionButtonStyled } from "@/components/SectionPagination/SectionPagination";
import DetailTable from "@/components/Wednesday/Details/DetailTable";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";
import { axiosGetPresentationSchedule } from "@/api/axios/axios.custom";

export interface IDate {
  year: string;
  month: string;
  day: string;
}

const DetailPage = () => {
  const [currentDate, setCurrentDate] = useState<IDate | null>(null);
  const [todayDate, setTodayDate] = useState<IDate | null>(null);
  const [presentationDetailInfo, setPresentationDetailInfo] = useState<
    IPresentationScheduleDetailInfo[] | null
  >(null);

  const makeIDateObj = (date: Date) => {
    let dateISO = date.toISOString();
    // 1. T 앞에서 끊고
    let dateBeforeT = dateISO.substring(0, 10);
    // 2. -로 분리
    let dateSplited = dateBeforeT.split("-");

    const todayDateObj: IDate = {
      year: dateSplited[0],
      month: dateSplited[1],
      day: dateSplited[2],
    };

    return todayDateObj;
  };

  // TODO : 오늘 날짜 recoil로 있으면 좋을듯
  useEffect(() => {
    const todayDateObj = makeIDateObj(new Date());

    // year, month, day 다 같으면 갈아끼우지말기
    if (
      !(
        todayDate?.year === todayDateObj.year ||
        todayDate?.month === todayDateObj.month ||
        todayDate?.day === todayDateObj.day
      )
    )
      setTodayDate(todayDateObj);

    setCurrentDate(todayDateObj);
  }, []);

  useEffect(() => {
    if (currentDate) getPresentationSchedule(currentDate);
  }, [currentDate]);

  const getPresentationSchedule = async (requestDate: IDate) => {
    try {
      const response = await axiosGetPresentationSchedule(
        requestDate.year + "-" + requestDate.month
      );
      setPresentationDetailInfo(response.data.forms);
      // TODO setIsCurrentSectionRender(true);
    } catch (error: any) {
      // TODO
    } finally {
      // TODO
    }
  };

  const moveMonth = (direction: string) => {
    let requestDate: IDate = { ...currentDate! };
    let currentDateMonth = parseInt(currentDate!.month);
    let currentDateYear = parseInt(currentDate!.year);

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
        <DetailTable
          presentationDetailInfo={presentationDetailInfo}
          makeIDateObj={makeIDateObj}
        />
      </BodyStyled>
    </ContainerStyled>
  );
};

export default DetailPage;

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
  width: 80%;
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
