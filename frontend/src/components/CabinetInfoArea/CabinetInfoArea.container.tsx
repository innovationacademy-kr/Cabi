import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import AdminCabinetInfoArea from "@/components/CabinetInfoArea/AdminCabinetInfoArea";
import CabinetInfoArea from "@/components/CabinetInfoArea/CabinetInfoArea";
import AdminLentLog from "@/components/LentLog/AdminLentLog";
import {
  CabinetInfo,
  CabinetPreviewInfo,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import useMenu from "@/hooks/useMenu";
import useMultiSelect from "@/hooks/useMultiSelect";

export interface ISelectedCabinetInfo {
  floor: number;
  section: string;
  cabinetId: number;
  visibleNum: number;
  status: CabinetStatus;
  lentType: CabinetType;
  userNameList: string;
  expireDate?: Date;
  detailMessage: string | null;
  detailMessageColor: string;
  isAdmin: boolean;
  isLented: boolean;
  lentsLength: number;
}

export interface IMultiSelectTargetInfo {
  targetCabinetInfoList: CabinetPreviewInfo[];
  typeCounts: {
    AVAILABLE: number;
    OVERDUE: number;
    FULL: number;
    BROKEN: number;
    IN_SESSION: number;
    PENDING: number;
  };
}

export interface ICurrentModalStateInfo {
  lentModal: boolean;
  unavailableModal: boolean;
  returnModal: boolean;
  memoModal: boolean;
  passwordCheckModal: boolean;
  invitationCodeModal: boolean;
  extendModal: boolean;
  cancelModal: boolean;
}

export interface IAdminCurrentModalStateInfo {
  returnModal: boolean;
  statusModal: boolean;
  clubLentModal: boolean;
}

interface ICount {
  AVAILABLE: number;
  FULL: number;
  OVERDUE: number;
  BROKEN: number;
  IN_SESSION: number;
  PENDING: number;
}

export type TModalState =
  | "lentModal"
  | "unavailableModal"
  | "returnModal"
  | "memoModal"
  | "passwordCheckModal"
  | "invitationCodeModal"
  | "extendModal"
  | "cancelModal";

export type TAdminModalState = "returnModal" | "statusModal" | "clubLentModal";

const calExpiredTime = (expireTime: Date) =>
  Math.floor(
    (expireTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

const setExpireDate = (date: Date | undefined) => {
  if (!date) return null;
  if (date.toString().slice(0, 4) === "9999") return null;
  return date.toString().slice(0, 10);
};

const getCalcualtedTimeString = (expireTime: Date) => {
  const remainTime = calExpiredTime(expireTime);
  return remainTime < 0
    ? `반납일이 ${-remainTime}일 지났습니다`
    : `반납일이 ${remainTime}일 남았습니다`;
};

const getCabinetUserList = (selectedCabinetInfo: CabinetInfo): string => {
  // 동아리 사물함인 경우 cabinet_title에 있는 동아리 이름 반환
  const { lentType, title, maxUser, lents } = selectedCabinetInfo;
  if (lentType === "CLUB" && title) return title;
  else if (maxUser === 0) return lents[0].name;

  // 그 외에는 유저리스트 반환
  const userNameList = new Array(maxUser)
    .fill(null)
    .map((_, idx) => lents[idx])
    .map((info) => (info ? info.name : "-"))
    .join("\n");
  return userNameList;
};

const getDetailMessage = (selectedCabinetInfo: CabinetInfo): string | null => {
  const { status, lentType, lents } = selectedCabinetInfo;
  // 밴, 고장 사물함
  if (status === CabinetStatus.BANNED || status === CabinetStatus.BROKEN)
    return "사용 불가";
  // 동아리 사물함
  else if (lentType === "CLUB") return "동아리 사물함";
  // 사용 중 사물함
  else if (
    status === CabinetStatus.LIMITED_AVAILABLE ||
    status === CabinetStatus.FULL ||
    status === CabinetStatus.OVERDUE
  )
    return getCalcualtedTimeString(new Date(lents[0].expiredAt));
  // 빈 사물함
  else return null;
};

const getDetailMessageColor = (selectedCabinetInfo: CabinetInfo): string => {
  const { status, lentType, lents } = selectedCabinetInfo;
  // 밴, 고장 사물함
  if (status === CabinetStatus.BANNED || status === CabinetStatus.BROKEN)
    return "var(--expired)";
  // 사용 중 사물함
  else if (
    (status === CabinetStatus.FULL && lentType !== "CLUB") ||
    status === CabinetStatus.OVERDUE
  )
    return calExpiredTime(new Date(lents[0].expiredAt)) < 0
      ? "var(--expired)"
      : "var(--black)";
  // 빈 사물함
  else return "var(--black)";
};

const CabinetInfoAreaContainer = (): JSX.Element => {
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState(
    targetCabinetInfoState
  );
  const [myCabinetInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const myInfo = useRecoilValue<UserDto>(userState);
  const { isMultiSelect, targetCabinetInfoList } = useMultiSelect();
  const { closeCabinet, toggleLent } = useMenu();
  const { isSameStatus, isSameType } = useMultiSelect();
  const isAdmin = document.location.pathname.indexOf("/admin") > -1;
  const [userModal, setUserModal] = useState<ICurrentModalStateInfo>({
    lentModal: false,
    unavailableModal: false,
    returnModal: false,
    memoModal: false,
    passwordCheckModal: false,
    invitationCodeModal: false,
    extendModal: false,
    cancelModal: false,
  });
  const [adminModal, setAdminModal] = useState<IAdminCurrentModalStateInfo>({
    returnModal: false,
    statusModal: false,
    clubLentModal: false,
  });

  const cabinetViewData: ISelectedCabinetInfo | null = targetCabinetInfo
    ? {
        floor: targetCabinetInfo.floor,
        section: targetCabinetInfo.section,
        cabinetId: targetCabinetInfo.cabinetId,
        visibleNum: targetCabinetInfo.visibleNum,
        status: targetCabinetInfo.status,
        lentType: targetCabinetInfo.lentType,
        userNameList: getCabinetUserList(targetCabinetInfo),
        expireDate: targetCabinetInfo.lents[0]?.expiredAt,
        detailMessage: getDetailMessage(targetCabinetInfo),
        detailMessageColor: getDetailMessageColor(targetCabinetInfo),
        isAdmin: isAdmin,
        isLented: targetCabinetInfo.lents.length !== 0,
        lentsLength: targetCabinetInfo.lents.length,
      }
    : null;

  const countTypes = (cabinetList: CabinetPreviewInfo[]) =>
    cabinetList.reduce(
      (result, cabinet): ICount => {
        if (cabinet.status === CabinetStatus.LIMITED_AVAILABLE)
          result["AVAILABLE"]++;
        else if (cabinet.status === CabinetStatus.BANNED) result["BROKEN"]++;
        else result[cabinet.status]++;
        return result;
      },
      {
        AVAILABLE: 0,
        FULL: 0,
        OVERDUE: 0,
        BROKEN: 0,
        IN_SESSION: 0,
        PENDING: 0,
      }
    );

  const multiSelectInfo: IMultiSelectTargetInfo | null = isMultiSelect
    ? {
        targetCabinetInfoList: targetCabinetInfoList,
        typeCounts: countTypes(targetCabinetInfoList),
      }
    : null;

  const openModal = (modalName: TModalState) => {
    if (modalName === "lentModal" && myCabinetInfo.cabinetId) {
      modalName = "unavailableModal";
    } else if (
      modalName === "returnModal" &&
      targetCabinetInfo.floor === 3 &&
      targetCabinetInfo.lents.length === 1
    ) {
      modalName = "passwordCheckModal";
    } else if (
      modalName === "lentModal" &&
      cabinetViewData?.status == "IN_SESSION" &&
      cabinetViewData.lentsLength >= 1
    ) {
      modalName = "invitationCodeModal";
    } else if (
      modalName === "extendModal" &&
      cabinetViewData?.lentsLength &&
      cabinetViewData.lentsLength >= 1
    ) {
      modalName = "extendModal";
    }
    setUserModal({
      ...userModal,
      [modalName]: true,
    });
  };

  const closeModal = (modalName: TModalState) => {
    setUserModal({
      ...userModal,
      [modalName]: false,
    });
  };

  const openAdminModal = (modalName: TAdminModalState) => {
    setAdminModal({
      ...adminModal,
      [modalName]: true,
    });
  };

  const closeAdminModal = (modalName: TAdminModalState) => {
    setAdminModal({
      ...adminModal,
      [modalName]: false,
    });
  };

  const checkMultiReturn = (selectedCabinets: CabinetPreviewInfo[]) => {
    const returnable = selectedCabinets.find(
      (cabinet) => cabinet.userCount >= 1
    );
    if (returnable !== undefined) {
      return true;
    }
    return false;
  };

  const checkMultiStatus = (selectedCabinets: CabinetPreviewInfo[]) => {
    // 캐비넷 일괄 상태 관리 모달을 열기 위한 조건
    // 선택된 캐비넷들이 같은 타입, 같은 상태여야 함.
    if (isSameType(selectedCabinets) && isSameStatus(selectedCabinets))
      return true;
    return false;
  };

  return isAdmin ? (
    <>
      <AdminCabinetInfoArea
        selectedCabinetInfo={cabinetViewData}
        closeCabinet={closeCabinet}
        multiSelectTargetInfo={multiSelectInfo}
        openLent={toggleLent}
        adminModal={adminModal}
        openModal={openAdminModal}
        closeModal={closeAdminModal}
        checkMultiReturn={checkMultiReturn}
        checkMultiStatus={checkMultiStatus}
        expireDate={setExpireDate(cabinetViewData?.expireDate)}
      />
      <AdminLentLog lentType={"CABINET"} />
    </>
  ) : (
    <CabinetInfoArea
      selectedCabinetInfo={cabinetViewData}
      closeCabinet={closeCabinet}
      expireDate={setExpireDate(cabinetViewData?.expireDate)}
      isMine={
        myCabinetInfo?.cabinetId === cabinetViewData?.cabinetId ||
        myCabinetInfo?.cabinetId === 0
      }
      isAvailable={
        (cabinetViewData?.status === "AVAILABLE" ||
          cabinetViewData?.status === "LIMITED_AVAILABLE" ||
          cabinetViewData?.status === "IN_SESSION") &&
        !myCabinetInfo.cabinetId
      }
      isExtensible={myInfo.extensible}
      userModal={userModal}
      openModal={openModal}
      closeModal={closeModal}
    />
  );
};

export default CabinetInfoAreaContainer;
