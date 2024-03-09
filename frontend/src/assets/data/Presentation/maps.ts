import {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
  PresentationStatusType,
} from "@/types/enum/Presentation/presentation.type.enum";

export const PresentationStatusTypeLabelMap = {
  [PresentationStatusType.EXPECTED]: "발표예정",
  [PresentationStatusType.DONE]: "발표완료",
  [PresentationStatusType.CANCLE]: "발표취소",
};

export const PresentationPeriodTypeLabelMap = {
  [PresentationPeriodType.HALF]: 30,
  [PresentationPeriodType.HOUR]: 60,
  [PresentationPeriodType.HOUR_HALF]: 90,
  [PresentationPeriodType.TWO_HOUR]: 120,
};

export const PresentationLocationLabelMap = {
  [PresentationLocation.BASEMENT]: "지하 1층",
  [PresentationLocation.FIRST]: "1층",
  [PresentationLocation.THIRD]: "3층",
};

export const PresentationCategoryTypeLabelMap = {
  [PresentationCategoryType.DEVELOP]: "개발",
  [PresentationCategoryType.HOBBY]: "취미",
  [PresentationCategoryType.JOB]: "취업",
  [PresentationCategoryType.ETC]: "기타",
  [PresentationCategoryType.TASK]: "42",
  [PresentationCategoryType.STUDY]: "학술",
};
