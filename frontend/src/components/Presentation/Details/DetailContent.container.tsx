import { useEffect, useState } from "react";
import DetailContent from "@/components/Presentation/Details/DetailContent";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";
import { axiosGetPresentationSchedule } from "@/api/axios/axios.custom";
import { calculateAvailableDaysInWeeks } from "@/utils/Presentation/dateUtils";

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

  const makeIDateObj = (date: Date) => {
    let offset = date.getTimezoneOffset() * 60000;
    let dateOffset = new Date(date.getTime() - offset);

    let dateISO = dateOffset.toISOString();
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

  const getPresentationSchedule = async (requestDate: IDate) => {
    try {
      const response = await axiosGetPresentationSchedule(
        requestDate.year + "-" + requestDate.month
      );
      let objAry = response.data.forms;
      const availableDays = calculateAvailableDaysInWeeks(
        new Date(
          parseInt(todayDate!.year),
          parseInt(todayDate!.month) - 1,
          parseInt(todayDate!.day)
        ),
        [1, 3],
        3,
        3
      );
      if (objAry.length < 2) {
        // availableDays 중 requestDate랑 달이 같은 것들 추출
        const sameMonth = availableDays.filter((date) => {
          return date.getMonth() + 1 === parseInt(requestDate.month);
        });
        if (objAry.length === 0) {
          // 해당 월의 날짜 2개의 IPresentationScheduleDetailInfo 배열을 만든다
          objAry = sameMonth.map((day) => {
            return {
              id: null,
              subject: null,
              summary: null,
              detail: null,
              dateTime: day.toISOString(),
              category: null,
              userName: null,
              presentationTime: null,
            };
          });
        }
        if (objAry.length === 1) {
          const date = new Date(objAry[0].dateTime);
          console.log(date.getDate());
          objAry = sameMonth.map((day) => {
            if (day.getDate() === date.getDate()) return objAry[0];
            else
              return {
                id: null,
                subject: null,
                summary: null,
                detail: null,
                dateTime: day.toISOString(),
                category: null,
                userName: null,
                presentationTime: null,
              };
          });
        }
      }

      // toisostring으로 변환
      setPresentationDetailInfo(objAry);
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
