import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isCurrentModalState } from "@/Presentation/recoil/atoms";
import DetailContent from "@/Presentation/components/Details/DetailContent";
import { IPresentationScheduleDetailInfo } from "@/Presentation/types/dto/presentation.dto";
import {
  axiosGetPresentationSchedule,
  getAdminPresentationSchedule,
} from "@/Presentation/api/axios/axios.custom";
import {
  calculateAvailableDaysInWeeks,
  makeIDateObj,
} from "@/Presentation/utils/dateUtils";
import {
  AVAILABLE_WEEKS,
  FUTURE_MONTHS_TO_DISPLAY,
} from "@/Presentation/constants/policy";

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
  const firstPresentationDate: IDate = { year: "2024", month: "3", day: "1" };
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("admin/presentation");
  const [isCurrentRender, setIsCurrentRender] =
    useRecoilState(isCurrentModalState);

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
    setIsCurrentRender(false);
    if (currentDate) getPresentationSchedule(currentDate);
  }, [currentDate, isCurrentRender]);

  const getPresentationSchedule = async (requestDate: IDate) => {
    try {
      const response = !isAdmin
        ? await axiosGetPresentationSchedule(
            requestDate.year + "-" + requestDate.month
          )
        : await getAdminPresentationSchedule(
            requestDate.year + "-" + requestDate.month
          );
      let objAry: IPresentationScheduleDetailInfo[] = response.data.forms;
      const availableDays = calculateAvailableDaysInWeeks(
        new Date(
          parseInt(todayDate!.year),
          parseInt(todayDate!.month) - 1,
          parseInt(todayDate!.day)
        ),
        AVAILABLE_WEEKS,
        3,
        FUTURE_MONTHS_TO_DISPLAY
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
              presentationStatus: null,
              presentationLocation: null,
            };
          });
        }
        if (objAry.length === 1) {
          const date = new Date(objAry[0].dateTime);
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
                presentationStatus: null,
                presentationLocation: null,
              };
          });
        }
      }

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
      canMoveLeft={
        currentDate
          ? parseInt(currentDate.month) > parseInt(firstPresentationDate.month)
          : false
      }
      canMoveRight={
        currentDate && todayDate
          ? parseInt(currentDate.month) <
            parseInt(todayDate.month) + FUTURE_MONTHS_TO_DISPLAY - 1
          : false
      }
    />
  );
};

export default DetailContentContainer;
