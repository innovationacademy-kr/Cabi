import {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
  PresentationStatusType,
} from "@/types/enum/Presentation/presentation.type.enum";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

export interface PresentationHistoryDto {
  id: number;
  dateTime: string;
  subject: string;
  presentationLocation: PresentationLocation;
  presentationStatus: PresentationStatusType;
}

export type PresentationHistoryResponseType =
  | PresentationHistoryDto[]
  | typeof STATUS_400_BAD_REQUEST
  | undefined;

export interface IPresentationInfo {
  id: number | null;
  dateTime: string;
  presentationStatus?: string | null;
  presentationTime: PresentationPeriodType | null;
  presentationLocation?: string | null;
  detail: string | null;
}

export interface IPresentationScheduleDetailInfo {
  id: number | null;
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
export interface IAnimation {
  min_width: number;
  min_height: number;
  max_width: number;
  max_height: number;
}

export interface IPresentationCategoryIcon {
  name: string;
  key: string;
}
