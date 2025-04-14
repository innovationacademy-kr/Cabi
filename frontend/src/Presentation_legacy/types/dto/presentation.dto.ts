import { HttpStatusCode } from "axios";
import {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
  PresentationStatusType,
} from "@/Presentation_legacy/types/enum/presentation.type.enum";

// NOTE : dto.ts 파일은 백엔드에 데이터 보낼때, 받을때의 형식을 interface로 정의하는 파일

export interface PresentationHistoryDto {
  id: number;
  dateTime: string;
  subject: string;
  presentationLocation: PresentationLocation;
  presentationStatus: PresentationStatusType;
}

export type PresentationHistoryResponseType =
  | PresentationHistoryDto[]
  | HttpStatusCode.BadRequest
  | undefined;

export interface IPresentationInfo {
  id: number | null;
  dateTime: string;
  presentationStatus?: string | null;
  presentationTime: PresentationPeriodType | null;
  presentationLocation?: string | null;
  detail: string | null;
  userName: string | null;
}

export interface IPresentationScheduleDetailInfo {
  id: number | null;
  subject: string | null;
  summary: string | null;
  detail: string | null;
  dateTime: string;
  category: PresentationCategoryType | null;
  userName: string | null;
  presentationStatus: PresentationStatusType | null;
  presentationTime: PresentationPeriodType | null;
  presentationLocation: PresentationLocation | null;
}

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
