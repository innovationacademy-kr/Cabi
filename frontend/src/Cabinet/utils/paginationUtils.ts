export const getTotalPage = (totalLength: number, size: number) => {
  return Math.ceil(totalLength / size);
};
