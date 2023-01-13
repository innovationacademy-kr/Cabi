import CabinetStatus from "./types/enum/cabinet.status.enum";
import CabinetType from "./types/enum/cabinet.type.enum";

export const cabinetIconSrcMap = {
  [CabinetType.PRIVATE]: "src/assets/images/privateIcon.svg",
  [CabinetType.SHARE]: "src/assets/images/shareIcon.svg",
  [CabinetType.CIRCLE]: "src/assets/images/circleIcon.svg",
};

export const cabinetLabelColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--white)",
  [CabinetStatus.SET_EXPIRE_FULL]: "var(--black)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "var(--white)",
  [CabinetStatus.EXPIRED]: "var(--white)",
  [CabinetStatus.BROKEN]: "var(--white)",
  [CabinetStatus.BANNED]: "var(--white)",
};

export const cabinetStatusColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--available)",
  [CabinetStatus.SET_EXPIRE_FULL]: "var(--full)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "var(--available)",
  [CabinetStatus.EXPIRED]: "var(--expired)",
  [CabinetStatus.BROKEN]: "var(--broken)",
  [CabinetStatus.BANNED]: "var(--banned)",
};

export const modalPropsMap = {
  [CabinetStatus.AVAILABLE]: {
    type: "confirm",
    title: "이용 시 주의 사항",
    confirmMessage: "네, 대여할게요",
  },
  [CabinetStatus.SET_EXPIRE_FULL]: {
    type: "error",
    title: "이미 사용 중인 사물함입니다",
    confirmMessage: "",
  },
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: {
    type: "confirm",
    title: "이용 시 주의 사항",
    confirmMessage: "네, 대여할게요",
  },
  [CabinetStatus.EXPIRED]: {
    type: "error",
    title: `반납이 지연되고 있어\n현재 대여가 불가합니다`,
    confirmMessage: "",
  },
  [CabinetStatus.BROKEN]: {
    type: "error",
    title: "사용이 불가한 사물함입니다",
    confirmMessage: "",
  },
  [CabinetStatus.BANNED]: {
    type: "error",
    title: "사용이 불가한 사물함입니다",
    confirmMessage: "",
  },
  return: {
    type: "confirm",
    title: "사물함 반납하기",
    confirmMessage: "네, 반납할게요",
  },
};

export const cabinetFilterMap = {
  [CabinetStatus.AVAILABLE]: "brightness(100)",
  [CabinetStatus.SET_EXPIRE_FULL]: "none",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "brightness(100)",
  [CabinetStatus.EXPIRED]: "brightness(100)",
  [CabinetStatus.BROKEN]: "brightness(100)",
  [CabinetStatus.BANNED]: "brightness(100)",
};
