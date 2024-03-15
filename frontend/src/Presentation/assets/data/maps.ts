import { PresentationTimeKey } from "@/Presentation/pages/RegisterPage";
import {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
  PresentationStatusType,
} from "@/Presentation/types/enum/presentation.type.enum";

export const PresentationStatusTypeLabelMap = {
  [PresentationStatusType.EXPECTED]: "발표예정",
  [PresentationStatusType.DONE]: "발표완료",
  [PresentationStatusType.CANCEL]: "발표취소",
};

export const PresentationPeriodTypeNumberLabelMap = {
  [PresentationPeriodType.NONE]: 0,
  [PresentationPeriodType.HALF]: 30,
  [PresentationPeriodType.HOUR]: 60,
  [PresentationPeriodType.HOUR_HALF]: 90,
  [PresentationPeriodType.TWO_HOUR]: 120,
};

export const PresentationTimeMap: {
  [key in PresentationTimeKey]: PresentationPeriodType;
} = {
  "": PresentationPeriodType.NONE,
  "30분": PresentationPeriodType.HALF,
  "1시간": PresentationPeriodType.HOUR,
  "1시간 30분": PresentationPeriodType.HOUR_HALF,
  "2시간": PresentationPeriodType.TWO_HOUR,
};

export const PresentationLocationLabelMap = {
  [PresentationLocation.BASEMENT]: "지하 1층 오픈스튜디오",
  [PresentationLocation.FIRST]: "1층 오픈스튜디오",
  [PresentationLocation.THIRD]: "3층 세미나실",
};

export const PresentationCategoryTypeLabelMap = {
  [PresentationCategoryType.DEVELOP]: "개발",
  [PresentationCategoryType.STUDY]: "학술",
  [PresentationCategoryType.HOBBY]: "취미",
  [PresentationCategoryType.JOB]: "취업",
  [PresentationCategoryType.TASK]: "42",
  [PresentationCategoryType.ETC]: "기타",
};
