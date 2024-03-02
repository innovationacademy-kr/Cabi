import { useEffect, useState } from "react";
import DetailContent from "@/components/Wednesday/Details/DetailContent";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";
import { axiosGetPresentationSchedule } from "@/api/axios/axios.custom";

export interface IDate {
  year: string;
  month: string;
  day: string;
}

const DetailContentContainer = () => {
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

    const iDateObj: IDate = {
      year: dateSplited[0],
      month: dateSplited[1],
      day: dateSplited[2],
    };

    return iDateObj;
  };

  useEffect(() => {
    const tmpTodayDate = makeIDateObj(new Date());

    if (
      !(
        todayDate?.year === tmpTodayDate.year ||
        todayDate?.month === tmpTodayDate.month ||
        todayDate?.day === tmpTodayDate.day
      )
    )
      setTodayDate(tmpTodayDate);

    setCurrentDate(tmpTodayDate);
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
    <DetailContent
      moveMonth={moveMonth}
      currentDate={currentDate}
      presentationDetailInfo={presentationDetailInfo}
      makeIDateObj={makeIDateObj}
    />
  );
};

export default DetailContentContainer;
