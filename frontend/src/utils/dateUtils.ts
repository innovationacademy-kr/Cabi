export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const formatDate = (date: Date | null, divider: string) => {
  if (date === null) return "";
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join(divider);
};

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

// 공유 사물함 반납 시 남은 대여일 수 차감 (원래 남은 대여일 수 * (남은 인원 / 원래 있던 인원))
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

export const getExtendedDateString = (
  existExpireDate: Date | undefined,
  dateToExtend: number | undefined
) => {
  if (existExpireDate === undefined || dateToExtend === undefined) return;
  let expireDate = new Date(existExpireDate);
  expireDate.setDate(expireDate.getDate() + dateToExtend);
  return formatDate(expireDate, "/");
};

export const getTotalPage = (totalLength: number, size: number) => {
  return Math.ceil(totalLength / size);
};

export const calExpiredTime = (expireTime: Date) =>
  Math.floor(
    (expireTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

export const getRemainingTime = (expireTime: Date | undefined) => {
  if (!expireTime) return 0;
  const remainTime = calExpiredTime(new Date(expireTime));
  return remainTime < 0 ? -remainTime : remainTime;
};

export const getExpireDate = (date: Date | undefined) => {
  if (!date) return null;
  if (date.toString().slice(0, 4) === "9999") return null;
  return date.toString().slice(0, 10);
};
