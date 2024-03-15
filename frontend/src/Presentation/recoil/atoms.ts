import { atom } from "recoil";
import { IPresentationInfo } from "@/Presentation/types/dto/presentation.dto";

/**
 * 수지회 (구 까비지식회)
 */
export const currentPresentationState = atom<IPresentationInfo | null>({
  key: "currentPresentationId",
  default: undefined,
});
