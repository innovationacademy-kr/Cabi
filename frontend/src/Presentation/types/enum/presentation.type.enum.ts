export enum PresentationStatusType {
  EXPECTED = "EXPECTED",
  DONE = "DONE",
  CANCEL = "CANCEL",
}

export enum PresentationPeriodType {
  NONE = "NONE",
  HALF = "HALF",
  HOUR = "HOUR",
  HOUR_HALF = "HOUR_HALF",
  TWO_HOUR = "TWO_HOUR",
}

export enum PresentationLocation {
  BASEMENT = "BASEMENT",
  FIRST = "FIRST",
  THIRD = "THIRD",
}

export enum PresentationCategoryType {
  DEVELOP = "DEVELOP",
  // HOBBY = "HOBBY",
  DISCUSSION = "DISCUSSION",
  STUDY = "STUDY",
  JOB = "JOB",
  ETC = "ETC",
  TASK = "TASK",
}

export const PRESENTATION_PERIOD_LABELS: Record<PresentationPeriodType, string> = {
  [PresentationPeriodType.NONE] : "없음",
  [PresentationPeriodType.HALF] : "30분",
  [PresentationPeriodType.HOUR]: "1시간",
  [PresentationPeriodType.HOUR_HALF]: "1시간 30분",
  [PresentationPeriodType.TWO_HOUR]: "2시간",
}

export const PRESENTATION_CATEGORY_LABELS: Record<PresentationCategoryType, string> = {
  [PresentationCategoryType.DEVELOP]: "개발",
  [PresentationCategoryType.DISCUSSION]: "토의",
  [PresentationCategoryType.STUDY]: "학술",
  [PresentationCategoryType.JOB]: "취업",
  [PresentationCategoryType.TASK]: "42",
  [PresentationCategoryType.ETC]: "기타",
};

export enum RegisterType {
  CREATE = "CREATE",
  EDIT = "EDIT",
} 