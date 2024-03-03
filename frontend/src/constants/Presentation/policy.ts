// NOTE: 보여줄 개월 수
export const FUTURE_MONTHS_TO_DISPLAY = 3;

// NOTE: 발표 가능한 주차
export const AVAILABLE_WEEKS = (
  import.meta.env.VITE_AVAILABLE_WEEKS ?? "1,2,3,4"
)
  .split(",")
  .map(Number);
