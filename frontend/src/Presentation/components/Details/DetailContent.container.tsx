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
  toISOStringwithTimeZone,
} from "@/Presentation/utils/dateUtils";
import { WEDNESDAY } from "@/Presentation/constants/dayOfTheWeek";
import {
  AVAILABLE_WEEKS,
  FUTURE_MONTHS_TO_DISPLAY,
} from "@/Presentation/constants/policy";

export interface IDate {
  year: string;
  month: string;
  day: string;
}

const createEmptyPresentation = (day: Date) => ({
  id: null,
  subject: null,
  summary: null,
  detail: null,
  dateTime: toISOStringwithTimeZone(day),
  category: null,
  userName: null,
  presentationTime: null,
  presentationStatus: null,
  presentationLocation: null,
});

const findExistingPresentation = (
  presentations: IPresentationScheduleDetailInfo[],
  day: Date
) => {
  return presentations.find((p) => {
    const presentationDate = new Date(p.dateTime);
    return (
      presentationDate.getFullYear() === day.getFullYear() &&
      presentationDate.getMonth() === day.getMonth() &&
      presentationDate.getDate() === day.getDate()
    );
  });
};

const mergePresentationsWithDays = (
  presentations: IPresentationScheduleDetailInfo[],
  days: Date[]
) => {
  return days.map((day) => {
    const existingPresentation = findExistingPresentation(presentations, day);
    return existingPresentation || createEmptyPresentation(day);
  });
};

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
      const availableDays = calculateAvailableDaysInWeeks(
        new Date(
          parseInt(requestDate.year),
          parseInt(requestDate.month) - 1,
          1
        ),
        AVAILABLE_WEEKS,
        WEDNESDAY,
        1
      );
      const mergedPresentationInfo = mergePresentationsWithDays(
        response.data.forms as IPresentationScheduleDetailInfo[],
        availableDays
      );
      setPresentationDetailInfo(mergedPresentationInfo);
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
