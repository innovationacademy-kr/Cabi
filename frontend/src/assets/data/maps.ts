import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";

export enum additionalModalType {
  MODAL_RETURN = "MODAL_RETURN",
  MODAL_UNAVAILABLE_ALREADY_LENT = "MODAL_UNAVAILABLE_ALREADY_LENT",
  MODAL_ADMIN_RETURN = "MODAL_ADMIN_RETURN",
  MODAL_BAN = "MODAL_BAN",
  MODAL_ADMIN_LOGIN_FAILURE = "MODAL_ADMIN_LOGIN_FAILURE",
}

export const cabinetIconSrcMap = {
  [CabinetType.PRIVATE]: "/src/assets/images/privateIcon.svg",
  [CabinetType.SHARE]: "/src/assets/images/shareIcon.svg",
  [CabinetType.CLUB]: "/src/assets/images/clubIcon.svg",
};

export const cabinetLabelColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--white)",
  [CabinetStatus.FULL]: "var(--black)",
  [CabinetStatus.LIMITED_AVAILABLE]: "var(--white)",
  [CabinetStatus.OVERDUE]: "var(--white)",
  [CabinetStatus.BROKEN]: "var(--white)",
  [CabinetStatus.BANNED]: "var(--white)",
  MINE: "var(--black)",
};

export const cabinetStatusColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--available)",
  [CabinetStatus.FULL]: "var(--full)",
  [CabinetStatus.LIMITED_AVAILABLE]: "var(--available)",
  [CabinetStatus.OVERDUE]: "var(--overdue)",
  [CabinetStatus.BROKEN]: "var(--broken)",
  [CabinetStatus.BANNED]: "var(--banned)",
  MINE: "var(--mine)",
};

export const modalPropsMap = {
  [CabinetStatus.AVAILABLE]: {
    type: "confirm",
    title: "이용 시 주의 사항",
    confirmMessage: "네, 대여할게요",
  },
  [CabinetStatus.FULL]: {
    type: "error",
    title: "이미 사용 중인 사물함입니다",
    confirmMessage: "",
  },
  [CabinetStatus.LIMITED_AVAILABLE]: {
    type: "confirm",
    title: "이용 시 주의 사항",
    confirmMessage: "네, 대여할게요",
  },
  [CabinetStatus.OVERDUE]: {
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
  PASSWORD_CHECK: {
    type: "confirm",
    title: "반납 시  비밀번호",
    confirmMessage: "확인했습니다",
  },
  MODAL_RETURN: {
    type: "confirm",
    title: "사물함 반납하기",
    confirmMessage: "네, 반납할게요",
  },
  MODAL_UNAVAILABLE_ALREADY_LENT: {
    type: "error",
    title: "이미 대여 중인 사물함이 있습니다",
    confirmMessage: "",
  },
  MODAL_ADMIN_RETURN: {
    type: "confirm",
    title: "반납 처리",
    confirmMessage: "네, 반납할게요",
  },
  MODAL_BAN: {
    type: "confirm",
    title: "밴 해제하기",
    confirmMessage: "해제",
  },
  MODAL_ADMIN_LOGIN_FAILURE: {
    type: "error",
    title: "아이디 또는 비밀번호가\n일치하지 않습니다",
    confirmMessage: "",
  },
};

export const cabinetFilterMap = {
  [CabinetStatus.AVAILABLE]: "brightness(100)",
  [CabinetStatus.FULL]: "none",
  [CabinetStatus.LIMITED_AVAILABLE]: "brightness(100)",
  [CabinetStatus.OVERDUE]: "brightness(100)",
  [CabinetStatus.BROKEN]: "brightness(100)",
  [CabinetStatus.BANNED]: "brightness(100)",
};

export const cabinetStatusLabelMap = {
  [CabinetStatus.AVAILABLE]: "사용 가능",
  [CabinetStatus.LIMITED_AVAILABLE]: "사용 가능",
  [CabinetStatus.FULL]: "사용 가능",
  [CabinetStatus.OVERDUE]: "사용 가능",
  [CabinetStatus.BANNED]: "사용 불가",
  [CabinetStatus.BROKEN]: "사용 불가",
};

export const cabinetTypeLabelMap = {
  [CabinetType.CLUB]: "동아리 사물함",
  [CabinetType.PRIVATE]: "개인 사물함",
  [CabinetType.SHARE]: "공유 사물함",
};
