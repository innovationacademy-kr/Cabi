import { IDate } from "@/Presentation/components/Details/DetailContent.container";

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

const padToNDigits = (numToBePadded: number, maxLength: number) => {
  return `${Math.floor(Math.abs(numToBePadded))}`.padStart(maxLength, "0");
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
  return (
    sign + padToNDigits(offset / 60, 2) + ":" + padToNDigits(offset % 60, 2)
  );
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
    padToNDigits(date.getMonth() + 1, 2) +
    "-" +
    padToNDigits(date.getDate(), 2) +
    "T" +
    padToNDigits(date.getHours(), 2) +
    ":" +
    padToNDigits(date.getMinutes(), 2) +
    ":" +
    padToNDigits(date.getSeconds(), 2) +
    getTimeZoneOffset(date)
  );
};
