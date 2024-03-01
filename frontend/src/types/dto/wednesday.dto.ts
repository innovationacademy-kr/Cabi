import {
  PresentationCategoryType,
  PresentationPeriodType,
} from "@/types/enum/Presentation/presentation.type.enum";

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
