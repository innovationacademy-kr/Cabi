import {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
  PresentationStatusType,
} from "@/Presentation/types/enum/presentation.type.enum";
import { ReactComponent as AcademicIcon } from "@/Cabinet/assets/images/PresentationAcademic.svg";
import { ReactComponent as DevelopIcon } from "@/Cabinet/assets/images/PresentationDevelop.svg";
import { ReactComponent as EtcIcon } from "@/Cabinet/assets/images/PresentationEtc.svg";
import { ReactComponent as FortyTwoIcon } from "@/Cabinet/assets/images/PresentationFortyTwo.svg";
import { ReactComponent as JobIcon } from "@/Cabinet/assets/images/PresentationJob.svg";

export const PresentationStatusTypeLabelMap = {
  [PresentationStatusType.DONE]: "발표예정",
  [PresentationStatusType.UPCOMING]: "발표완료",
  [PresentationStatusType.CANCELED]: "발표취소",
};

export const PresentationPeriodTypeNumberLabelMap = {
  [PresentationPeriodType.NONE]: 0,
  [PresentationPeriodType.HALF]: 30,
  [PresentationPeriodType.HOUR]: 60,
  [PresentationPeriodType.HOUR_HALF]: 90,
  [PresentationPeriodType.TWO_HOUR]: 120,
};


export const PresentationLocationLabelMap = {
  [PresentationLocation.BASEMENT]: "지하 1층 오픈스튜디오",
  [PresentationLocation.FIRST]: "1층 오픈스튜디오",
  [PresentationLocation.THIRD]: "3층 세미나실",
};

export const PresentationCategoryTypeLabelMap = {
  [PresentationCategoryType.DEVELOP]: "개발",
  [PresentationCategoryType.STUDY]: "학술",
  [PresentationCategoryType.DISCUSSION]: "토의",
  [PresentationCategoryType.JOB]: "취업",
  [PresentationCategoryType.TASK]: "42",
  [PresentationCategoryType.ETC]: "기타",
};

type presentationCategoryIconMap = {
  [key in PresentationCategoryType]: React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >;
};

export const presentationCategoryIconMap = {
  [PresentationCategoryType.DEVELOP]: DevelopIcon,
  [PresentationCategoryType.STUDY]: AcademicIcon,
  // [PresentationCategoryType.HOBBY]: HobbyIcon,
  [PresentationCategoryType.JOB]: JobIcon,
  [PresentationCategoryType.TASK]: FortyTwoIcon,
  [PresentationCategoryType.ETC]: EtcIcon,
};
