import {
  PresentationCategoryType,
  PresentationPeriodType,
} from "@/types/enum/Presentation/presentation.type.enum";

export interface IPresentationScheduleDetailInfo {
  id?: number;
  subject?: string | null;
  // summary?: string | null;
  // TODO : summary로 변경 요청
  summery?: string | null;
  detail?: string | null;
  dateTime: string;
  // TODO : dateTime은 있어야 하지 않나..?
  category?: PresentationCategoryType | null;
  period?: PresentationPeriodType | null;
  userName?: string | null;
  presentationStatus?: string | null;
  presentationTime?: string | null;
  presentationLocation?: string | null;
}
