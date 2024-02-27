import {
  PresentationCategoryType,
  PresentationPeriodType,
} from "@/types/enum/Presentation/presentation.type.enum";

export interface IPresentationScheduleDetailInfo {
  id?: number;
  subject?: string;
  summary?: string;
  detail?: string;
  dateTime: string;
  category?: PresentationCategoryType;
  period?: PresentationPeriodType;
  userName?: string;
}
