import {
  PresentationCategoryType,
  PresentationPeriodType,
} from "@/types/enum/Presentation/presentation.type.enum";

export interface IPresentationInfo {
  id: number;
  dateTime: string;
  presentationStatus?: string | null;
  presentationTime: PresentationPeriodType | null;
  presentationLocation?: string | null;
}

export interface IPresentationScheduleDetailInfo {
  id: number;
  subject: string | null;
  summary: string | null;
  detail: string | null;
  dateTime: string;
  category: PresentationCategoryType | null;
  userName: string | null;
  presentationStatus?: string | null;
  presentationTime: PresentationPeriodType | null;
  presentationLocation?: string | null;
}

// 백엔드에 데이터 보낼때, 받을때의 형식을 interface로 정의하는 파일
