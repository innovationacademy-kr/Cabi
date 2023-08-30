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
  }
  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, "0");
  };
  const formatDate = (date: Date) => {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("/");
  };

  return formatDate(expireDate);
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
