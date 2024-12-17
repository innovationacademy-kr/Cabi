import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { padToNDigits } from "@/Cabinet/utils/dateUtils";
import { isCurrentModalState } from "@/Presentation/recoil/atoms";
import DetailContent from "@/Presentation/components/Details/DetailContent";
import { IPresentationScheduleDetailInfo } from "@/Presentation/types/dto/presentation.dto";
import {
  axiosGetPresentationSchedule,
  getAdminPresentationSchedule,
} from "@/Presentation/api/axios/axios.custom";
import { makeIDateObj } from "@/Presentation/utils/dateUtils";
import { FUTURE_MONTHS_TO_DISPLAY } from "@/Presentation/constants/policy";

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
  const firstPresentationDate: IDate = { year: "2024", month: "4", day: "24" };
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

  const fetchPresentationData = async (year: string, month: string) => {
    return !isAdmin
      ? await axiosGetPresentationSchedule(year + "-" + month)
      : await getAdminPresentationSchedule(year + "-" + month);
  };

  const getPresentationSchedule = async (requestDate: IDate) => {
    try {
      const response = await fetchPresentationData(
        requestDate.year,
        requestDate.month
      );
      const presentationInfo = response.data.forms;
      setPresentationDetailInfo(presentationInfo);
    } catch (error) {
      console.error("Error fetching presentation schedule:", error);
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
        requestDate.month = padToNDigits(currentDateMonth - 1, 2);
      }
    } else {
      if (currentDateMonth === 12) {
        requestDate.year = (currentDateYear + 1).toString();
        requestDate.month = padToNDigits(1, 2);
      } else {
        requestDate.month = padToNDigits(currentDateMonth + 1, 2);
      }
    }

    setCurrentDate(requestDate);
  };

  const compareDates = (date1: IDate, date2: IDate): number => {
    const d1 = new Date(parseInt(date1.year), parseInt(date1.month) - 1);
    const d2 = new Date(parseInt(date2.year), parseInt(date2.month) - 1);
    return d1.getTime() - d2.getTime();
  };

  const getMaxDate = (baseDate: IDate, monthsToAdd: number): IDate => {
    const date = new Date(
      parseInt(baseDate.year),
      parseInt(baseDate.month) - 1
    );
    date.setMonth(date.getMonth() + monthsToAdd);
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString(),
      day: baseDate.day,
    };
  };

  return (
    <DetailContent
      moveMonth={moveMonth}
      currentDate={currentDate}
      presentationDetailInfo={presentationDetailInfo}
      canMoveLeft={
        currentDate
          ? compareDates(currentDate, firstPresentationDate) > 0
          : false
      }
      canMoveRight={
        currentDate && todayDate
          ? compareDates(
              currentDate,
              getMaxDate(todayDate, FUTURE_MONTHS_TO_DISPLAY - 1)
            ) < 0
          : false
      }
    />
  );
};

export default DetailContentContainer;
