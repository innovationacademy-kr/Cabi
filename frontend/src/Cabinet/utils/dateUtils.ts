/**
 * @description 해당 월, 일의 앞자리를 0으로 채워 두 자리로 만듦
 *
 * @param num 날짜
 *
 * @returns 두 자리로 만들어진 날짜
 */
export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

/**
 * @description 해당 날짜의 년, 월, 일을 divider 로 구분하여 반환
 *
 * @param date 날짜
 * @param divider 구분자
 *
 * @returns 구분자로 구분된 년, 월, 일
 *
 * @example
 * const result = formatDate(new Date(), "-")
 * //=> "2023-04-14"
 */
export const formatDate = (date: Date | null, divider: string) => {
  if (date === null) return "";
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join(divider);
};

/**
 * @description 주어진 lentType에 따라 대여 만료일을 구해 "YYYY/MM/DD" 형식으로 반환. 예정된 대여 만료일이 있다면 그 일자를 반환
 *
 * @param lentType 대여 타입
 * @param existExpireDate 예정된 만료일
 *
 * @returns "YYYY/MM/DD" 형식의 대여 만료일
 */
export const getExpireDateString = (
  lentType: string,
  existExpireDate?: Date
) => {
  let expireDate = existExpireDate ? new Date(existExpireDate) : new Date();
  const addDays: string =
    lentType === "SHARE"
      ? import.meta.env.VITE_SHARE_LENT_PERIOD
      : import.meta.env.VITE_PRIVATE_LENT_PERIOD;

  if (!existExpireDate)
    expireDate.setDate(expireDate.getDate() + parseInt(addDays));
  return formatDate(expireDate, "/");
};

/**
 * @description 공유 사물함 반납 시 남은 대여일 수를 공식 (원래 남은 대여일 수 * (남은 인원 / 원래 있던 인원)) 에 따라 차감해 새로운 만료일을 "YYYY/MM/DD" 형식으로 반환
 *
 * @param lentType 대여 타입
 * @param currentNumUsers 현재 대여 중인 인원
 * @param existExpireDate 예정된 만료일
 *
 * @returns "YYYY/MM/DD" 형식의 새로운 대여 만료일
 */
export const getShortenedExpireDateString = (
  lentType: string,
  currentNumUsers: number,
  existExpireDate: Date | undefined
) => {
  if (lentType != "SHARE" || existExpireDate === undefined) return;
  const dayInMilisec = 1000 * 60 * 60 * 24;
  const expireDateInMilisec = new Date(existExpireDate).getTime();
  let secondUntilExpire = expireDateInMilisec - new Date().getTime();
  let daysUntilExpire = Math.ceil(secondUntilExpire / dayInMilisec) - 1;
  let dateRemainig =
    (daysUntilExpire * (currentNumUsers - 1)) / currentNumUsers;
  let newExpireDate = new Date().getTime() + dateRemainig * dayInMilisec;
  return formatDate(new Date(newExpireDate), "/");
};

/**
 * @description 주어진 날짜를 기준으로 주어진 일자만큼 만료일을 연장하여 "YYYY/MM/DD" 형식으로 반환
 *
 * @param existExpireDate 예정된 만료일
 * @param dateToExtend 연장할 일자
 *
 * @returns "YYYY/MM/DD" 형식의 연장된 대여 만료일
 */
export const getExtendedDateString = (
  existExpireDate: Date | undefined | null,
  dateToExtend: number | undefined
) => {
  if (!existExpireDate || dateToExtend === undefined) return;
  let expireDate = new Date(existExpireDate);
  expireDate.setDate(expireDate.getDate() + dateToExtend);
  return formatDate(expireDate, "/");
};

/**
 * @description 주어진 날짜를 기준으로 주어진 일자만큼 만료일을 축소하여 "YYYY/MM/DD" 형식으로 반환
 *
 * @param existExpireDate 예정된 만료일
 * @param dateToExtend 축소할 일자
 *
 * @returns "YYYY/MM/DD" 형식의 연장된 대여 만료일
 */
export const getReduceDateString = (
  existExpireDate: Date | undefined | null,
  dateToExtend: number | undefined
) => {
  if (!existExpireDate || dateToExtend === undefined) return;
  let expireDate = new Date(existExpireDate);
  console.log("expireDate", expireDate);
  expireDate.setDate(expireDate.getDate() - dateToExtend);
  return formatDate(expireDate, "/");
};

/**
 * @description 주어진 대여 만료일을 기준으로 남은 대여일 수를 계산하여 반환. 만료일이 지났다면 음수로 반환
 *
 * @param expireTime 대여 만료일
 *
 * @returns 남은 대여일 수
 */
export const calExpiredTime = (expireTime: Date) =>
  Math.floor(
    (expireTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

/**
 * @description 주어진 대여 만료일을 기준으로 남은 대여일 수를 계산하여 반환. 만료일이 지났다면 음수로 반환. expireTime 을 Date 로 변환 후 사용하는 Wrapper 함수
 *
 * @param expireTime 대여 만료일
 *
 * @returns 남은 대여일 수
 */
export const getRemainingTime = (expireTime: Date | undefined | null) => {
  if (!expireTime) return 0;
  const remainTime = calExpiredTime(new Date(expireTime));
  return remainTime < 0 ? -remainTime : remainTime;
};
