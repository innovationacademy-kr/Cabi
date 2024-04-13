import { addDays, addMonths, getDay, startOfMonth } from "date-fns";
import { IDate } from "@/Presentation/components/Details/DetailContent.container";

/**
 * @description 주어진 날짜부터 주어진 요일 이 되는 첫번째 날짜를 구함
 * (Sunday: 0, Monday: 1, ..., Saturday: 6)
 *
 * @param date 해당 요일을 찾기 시작할 날짜
 * @param dayOfTheWeek 찾고자 하는 요일 (0-6)
 *
 * @returns 주어진 날짜(date) 부터 주어진 요일(dayOfTheWeek) 이 되는 첫번째 날짜
 *
 * @example
 * // 2024년 3월 2일부터 금요일 (5) 이 되는 첫번째 날짜를 구함
 * const result = calculateFirstDayEncountered(new Date(2024, 2, 2), 5)
 * //=> Fri Mar 08 2024 00:00:00
 */
export const calculateFirstDayEncountered = (
  date: Date,
  dayOfTheWeek: number
) => {
  let firstOccurrence = date;
  while (getDay(firstOccurrence) !== dayOfTheWeek)
    firstOccurrence = addDays(firstOccurrence, 1);
  return firstOccurrence;
};

/**
 * @description 주어진 날짜 목록 (배열) 에서 유효하지 않은 날짜 (배열) 들을 필터링
 *
 * @param availableDates 날짜 목록
 * @param invalidDates 유효하지 않은 날짜 목록
 *
 * @returns 유효한 날짜 목록 (배열)
 *
 * @example
 * // [2023년 4월 14일, 2023년 4월 15일] 중 [2023년 4월 14일] 을 필터링한 배열을 반환
 * const result = filterInvalidDates([new Date(2023, 3, 14), new Date(2023, 3, 15)], ["2023-04-14"])
 * //=> [new Date(2023, 3, 15)]
 */
export const filterInvalidDates = (
  availableDates: Date[],
  invalidDates: string[] | Date[]
) => {
  if (!availableDates) return [];
  else if (!invalidDates) return availableDates;
  const invalidDatesFormatted = (invalidDates as string[]).map(
    (date) => new Date(date)
  );
  // NOTE: Date 객채의 시간이 다른 경우를 고려하여 날짜만 비교
  // TODO: 추후 하루에 여러 개의 발표가 가능한 경우, 시간까지 비교해야 함
  return availableDates.filter(
    (date) =>
      !invalidDatesFormatted.some(
        (invalidDate) =>
          date.getDate() === invalidDate.getDate() &&
          date.getMonth() === invalidDate.getMonth() &&
          date.getFullYear() === invalidDate.getFullYear()
      )
  );
};

/**
 * @description 기준 날짜 (baseDate) 부터 최대 maxMonthOffset 개월 내에서, 주어진 주차 (availableWeeks) 중 주어진 요일 (dayOfTheWeek) 에 해당하는 날짜들을 구함
 * (Sunday: 0, Monday: 1, ..., Saturday: 6)
 *
 * @param baseDate 기준 날짜
 * @param availableWeeks 보여줄 주차 목록
 * @param dayOfTheWeek 보여줄 요일 (0-6)
 * @param maxMonthOffset 계산할 최대 개월 수
 * @param filterPastDates 과거 날짜를 필터링할지 여부
 *
 * @returns maxMonthOffset 개월 내의 주어진 주차 중 주어진 요일 에 해당하는 날짜들
 *
 * @example
 * // 2024년 3월 4일부터 2개월 내에서, 매 달의 1, 3 주차 중 수요일 (3) 에 해당하는 날짜들을 구함
 * const result = calculateAvailableDaysInWeeks(new Date(2024, 2, 4), [1, 3], 3, 2, false)
 * //=> [Wed Mar 06 2024 00:00:00, Wed Mar 20 2024 00:00:00, Wed Apr 03 2024 00:00:00, Wed Apr 17 2024 00:00:00]
 */
export const calculateAvailableDaysInWeeks = (
  baseDate: Date,
  availableWeeks: number[],
  dayOfTheWeek: number,
  maxMonthOffset: number,
  filterPastDates: boolean = false
) => {
  let availableDates: Date[] = [];
  const today = new Date();
  // NOTE: KST (UTC+9) 기준으로 시간을 설정
  today.setHours(today.getHours() + 9);
  // NOTE: baseDate부터 maxMonthOffset 달 만큼, availableWeeks 에 해당하는 주차 중 dayOfTheWeek 요일에 해당하는 날짜를 구함
  for (let monthOffset = 0; monthOffset < maxMonthOffset; monthOffset++) {
    // NOTE: baseDate부터 monthOffset 만큼의 달을 더한 달의 첫번째 날을 구함
    const monthStart = startOfMonth(addMonths(baseDate, monthOffset));
    // NOTE: 해당 월의 첫번째 요일 (dayOfTheWeek) 을 구함
    const firstOccurrence = calculateFirstDayEncountered(
      monthStart,
      dayOfTheWeek
    );
    availableWeeks.forEach((week) => {
      // NOTE: firstOccurrence 로부터 며칠을 더해야 해당 주 (week) 의 dayOfTheWeek 요일이 되는지 구함
      const weekOffset = (week - 1) * 7;
      const nextOccurrence = addDays(firstOccurrence, weekOffset);
      // NOTE: nextOccurrence 가 해당 월의 첫번째 날짜 (monthStart) 와 같은 달인지 확인
      if (
        nextOccurrence.getMonth() === monthStart.getMonth() &&
        (!filterPastDates || nextOccurrence >= today)
      )
        availableDates.push(nextOccurrence);
    });
  }
  return availableDates;
};

export const makeIDateObj = (date: Date): IDate => {
  const [year, month, day] = toISOStringwithTimeZone(date)
    .substring(0, 10)
    .split("-");
  return {
    year,
    month,
    day,
  };
};

const padTo2Digits = (num: number) => {
  return `${Math.floor(Math.abs(num))}`.padStart(2, "0");
};

/**
 * @description Date 객체의 타임존 오프셋을 문자열로 반환
 *
 * @param date Date 객체
 *
 * @returns 타임존 오프셋 문자열 (±HH:mm) (e.g., +09:00)
 */
const getTimeZoneOffset = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  // NOTE: offset 은 UTC 시간과의 차이를 분 단위로 나타냄
  const sign = offset > 0 ? "-" : "+";
  // NOTE: 시차를 시:분 형식으로 변환
  return sign + padTo2Digits(offset / 60) + ":" + padTo2Digits(offset % 60);
};

/**
 * @description toISOString() 와 같이 ISO 8601 형식의 문자열을 반환하지만, 타임존 오프셋을 포함
 *
 * @param date Date 객체
 *
 * @returns ISO 8601 형식의 문자열 (YYYY-MM-DDTHH:mm:ss±HH:mm) (e.g., 2021-08-31T23:59:59+09:00)
 */
export const toISOStringwithTimeZone = (date: Date): string => {
  return (
    date.getFullYear() +
    "-" +
    padTo2Digits(date.getMonth() + 1) +
    "-" +
    padTo2Digits(date.getDate()) +
    "T" +
    padTo2Digits(date.getHours()) +
    ":" +
    padTo2Digits(date.getMinutes()) +
    ":" +
    padTo2Digits(date.getSeconds()) +
    getTimeZoneOffset(date)
  );
};
