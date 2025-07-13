import {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
  PresentationStatusType,
} from "@/Presentation/types/enum/presentation.type.enum";

export const PresentationStatusTypeLabelMap: { [key: string]: string } = {
  DONE: "발표 완료",
  UPCOMING: "발표 예정",
  CANCELED: "발표 취소",
};

export const PresentationPeriodTypeNumberLabelMap = {
  [PresentationPeriodType.NONE]: 0,
  [PresentationPeriodType.HALF]: 30,
  [PresentationPeriodType.HOUR]: 60,
  [PresentationPeriodType.HOUR_HALF]: 90,
  [PresentationPeriodType.TWO_HOUR]: 120,
};

export const PresentationLocationLabelMap: { [key: string]: string } = {
  BASEMENT: "지하 1층 오픈스튜디오",
  FIRST: "1층 오픈스튜디오",
  THIRD: "3층 세미나실",
};

export const PresentationCategoryTypeLabelMap: { [key: string]: string } = {
  [PresentationCategoryType.DEVELOP]: "개발",
  [PresentationCategoryType.DISCUSSION]: "토의",
  [PresentationCategoryType.STUDY]: "학술",
  [PresentationCategoryType.JOB]: "취업",
  [PresentationCategoryType.TASK]: "42",
  [PresentationCategoryType.ETC]: "기타",
};

type presentationCategoryIconMap = {
  [key in PresentationCategoryType]: React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >;
};

export const defaultThumbnailMap: {
  [key in PresentationCategoryType]: string;
} = {
  DEVELOP: "https://i.imgur.com/2gobOis.png",
  DISCUSSION: "https://i.imgur.com/NXm2bfU.png",
  STUDY: "https://i.imgur.com/QQiHu69.png",
  JOB: "https://i.imgur.com/Lj8b60F.png",
  TASK: "https://i.imgur.com/bRoUtVr.jpeg",
  ETC: "https://i.imgur.com/ViJLyiR.png",
};
