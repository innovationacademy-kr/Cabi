export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const formatDate = (date: Date, divider: string) => {
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

  if (!existExpireDate) {
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

export const getExtendedDateString = (existExpireDate?: Date) => {
  let expireDate = existExpireDate ? new Date(existExpireDate) : new Date();
  expireDate.setDate(
    expireDate.getDate() + parseInt(import.meta.env.VITE_EXTENDED_LENT_PERIOD)
  );
  return formatDate(expireDate, "/");
};

export const getLastDayofMonthString = (date: Date | null, divider: string) => {
  if (date === null) date = new Date();
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return formatDate(lastDay, divider);
};

export const getTotalPage = (totalLength: number, size: number) => {
  return Math.ceil(totalLength / size);
};

export const getFormatDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};
