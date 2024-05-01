import { ReactComponent as ClubIcon } from "@/Cabinet/assets/images/clubIcon.svg";
import { ReactComponent as PrivateIcon } from "@/Cabinet/assets/images/privateIcon.svg";
import { ReactComponent as ShareIcon } from "@/Cabinet/assets/images/shareIcon.svg";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";

export enum additionalModalType {
  MODAL_RETURN = "MODAL_RETURN",
  MODAL_UNAVAILABLE_ALREADY_LENT = "MODAL_UNAVAILABLE_ALREADY_LENT",
  MODAL_ADMIN_RETURN = "MODAL_ADMIN_RETURN",
  MODAL_BAN = "MODAL_BAN",
  MODAL_ADMIN_LOGIN_FAILURE = "MODAL_ADMIN_LOGIN_FAILURE",
  MODAL_ADMIN_CLUB_CREATE = "MODAL_ADMIN_CLUB_CREATE",
  MODAL_ADMIN_CLUB_CREATE_FAILURE = "MODAL_ADMIN_CLUB_CREATE_FAILURE",
  MODAL_ADMIN_CLUB_EDIT = "MODAL_ADMIN_CLUB_EDIT",
  MODAL_ADMIN_CLUB_DELETE = "MODAL_ADMIN_CLUB_DELETE",
  MODAL_OVERDUE_PENALTY = "MODAL_OVERDUE_PENALTY",
  MODAL_USE_EXTENSION = "MODAL_USE_EXTENSION",
  MODAL_OWN_EXTENSION = "MODAL_OWN_EXTENSION",
  MODAL_CANCEL = "MODAL_CANCEL",
}

type CabinetIconComponentMap = {
  [key in CabinetType]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const cabinetIconComponentMap: CabinetIconComponentMap = {
  [CabinetType.PRIVATE]: PrivateIcon,
  [CabinetType.SHARE]: ShareIcon,
  [CabinetType.CLUB]: ClubIcon,
};

export const cabinetIconSrcMap = {
  [CabinetType.PRIVATE]: "/src/Cabinet/assets/images/privateIcon.svg",
  [CabinetType.SHARE]: "/src/Cabinet/assets/images/shareIcon.svg",
  [CabinetType.CLUB]: "/src/Cabinet/assets/images/clubIcon.svg",
};

export const cabinetLabelColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--white-text-with-bg-color)",
  [CabinetStatus.FULL]: "var(--ref-black)",
  // black
  [CabinetStatus.OVERDUE]: "var(--white-text-with-bg-color)",
  [CabinetStatus.BROKEN]: "var(--white-text-with-bg-color)",
  [CabinetStatus.BANNED]: "var(--white-text-with-bg-color)",
  [CabinetStatus.IN_SESSION]: "var(--sys-main-color)",
  [CabinetStatus.PENDING]: "var(--white-text-with-bg-color)",
  MINE: "var(--ref-black)",
  // black
};

export const cabinetStatusColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--available-color)",
  [CabinetStatus.FULL]: "var(--full-color)",
  [CabinetStatus.OVERDUE]: "var(--expired-color)",
  [CabinetStatus.BROKEN]: "var(--broken-color)",
  [CabinetStatus.BANNED]: "var(--banned-color)",
  [CabinetStatus.IN_SESSION]: "var(--session-color)",
  [CabinetStatus.PENDING]: "var(--pending-color)",
  MINE: "var(--mine-color)",
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
  [CabinetType.CLUB]: {
    type: "confirm",
    title: "동아리 대여",
    confirmMessage: "확인",
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
  MODAL_ADMIN_CLUB_CREATE: {
    type: "confirm",
    title: "동아리 생성하기",
    confirmMessage: "생성",
  },
  MODAL_ADMIN_CLUB_CREATE_FAILURE: {
    type: "error",
    title: "같은 이름의 동아리가\n이미 존재합니다",
    confirmMessage: "",
  },
  MODAL_ADMIN_CLUB_EDIT: {
    type: "confirm",
    title: "동아리 이름 수정",
    confirmMessage: "저장",
  },
  MODAL_ADMIN_CLUB_DELETE: {
    type: "confirm",
    title: "동아리 삭제하기",
    confirmMessage: "삭제",
  },
  MODAL_OVERDUE_PENALTY: {
    type: "error",
    title: "패널티 안내",
    confirmMessage: "오늘 하루동안 보지않기",
  },
  MODAL_INVITATION_CODE: {
    type: "confirm",
    title: "초대 코드",
    confirmMessage: "대여하기",
  },
  MODAL_USE_EXTENSION: {
    type: "confirm",
    title: "연장권 사용",
    confirmMessage: "연장하기",
  },
  MODAL_OWN_EXTENSION: {
    type: "confirm",
    title: "연장권 정보",
    confirmMessage: "",
  },
  MODAL_CANCEL: {
    type: "confirm",
    title: "대기열 취소하기",
    confirmMessage: "확인",
  },
  MODAL_SWAP: {
    type: "confirm",
    title: "이사하기",
    confirmMessage: "네, 이사할게요",
  },
  MODAL_CLUB_ADD_MEM: {
    type: "confirm",
    title: "동아리 멤버 추가",
    confirmMessage: "저장",
  },
  MODAL_CLUB_DEL_MEM: {
    type: "confirm",
    title: "멤버 내보내기",
    confirmMessage: "확인",
  },
  MODAL_CLUB_MANDATE_MEM: {
    type: "confirm",
    title: "동아리장 위임",
    confirmMessage: "네, 위임할게요",
  },
  MODAL_CLUB_PAGE_SET_PW: {
    type: "confirm",
    title: "비밀번호 설정",
    confirmMessage: "설정",
  },
  MODAL_CLUB_MODIFY_PW: {
    type: "confirm",
    title: "비밀번호 수적",
    confirmMessage: "입력",
  },
};

export const cabinetFilterMap = {
  [CabinetStatus.AVAILABLE]: "var(--white-text-with-bg-color)",
  [CabinetStatus.FULL]: "var(--ref-black)",
  // black
  [CabinetStatus.OVERDUE]: "var(--white-text-with-bg-color)",
  [CabinetStatus.BROKEN]: "var(--white-text-with-bg-color)",
  [CabinetStatus.BANNED]: "var(--white-text-with-bg-color)",
  [CabinetStatus.IN_SESSION]: "var(--normal-text-color)",
  [CabinetStatus.PENDING]: "var(--white-text-with-bg-color)",
};

export const cabinetStatusLabelMap = {
  [CabinetStatus.AVAILABLE]: "사용 가능",
  [CabinetStatus.FULL]: "사용 가능",
  [CabinetStatus.OVERDUE]: "사용 가능",
  [CabinetStatus.BANNED]: "사용 불가",
  [CabinetStatus.BROKEN]: "사용 불가",
  [CabinetStatus.IN_SESSION]: "대기중",
  [CabinetStatus.PENDING]: "오픈 예정",
};

export const cabinetTypeLabelMap = {
  [CabinetType.CLUB]: "동아리 사물함",
  [CabinetType.PRIVATE]: "개인 사물함",
  [CabinetType.SHARE]: "공유 사물함",
};
