import { useState } from "react";
import { useRecoilValue } from "recoil";
import { myCabinetInfoState, targetCabinetInfoState } from "@/recoil/atoms";
import AdminCabinetInfoArea from "@/components/CabinetInfoArea/AdminCabinetInfoArea";
import CabinetInfoArea from "@/components/CabinetInfoArea/CabinetInfoArea";
import AdminCabinetLentLogContainer from "@/components/LentLog/AdminCabinetLentLog.container";
import { CabinetInfo, MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import useMenu from "@/hooks/useMenu";
import useMultiSelect from "@/hooks/useMultiSelect";

export interface ISelectedCabinetInfo {
  floor: number;
  section: string;
  cabinetId: number;
  cabinetNum: number;
  status: CabinetStatus;
  lentType: CabinetType;
  userNameList: string;
  expireDate?: Date;
  detailMessage: string | null;
  detailMessageColor: string;
  isAdmin: boolean;
  isLented: boolean;
}

export interface IMultiSelectTargetInfo {
  targetCabinetInfoList: CabinetInfo[];
  typeCounts: {
    AVAILABLE: number;
    EXPIRED: number;
    SET_EXPIRE_FULL: number;
    BROKEN: number;
  };
}

export interface ICurrentModalStateInfo {
  lentModal: boolean;
  unavailableModal: boolean;
  returnModal: boolean;
  memoModal: boolean;
  passwordCheckModal: boolean;
}

export interface IAdminCurrentModalStateInfo {
  returnModal: boolean;
  statusModal: boolean;
}

interface ICount {
  AVAILABLE: number;
  SET_EXPIRE_FULL: number;
  EXPIRED: number;
  BROKEN: number;
}

export type TModalState =
  | "lentModal"
  | "unavailableModal"
  | "returnModal"
  | "memoModal"
  | "passwordCheckModal";

export type TAdminModalState = "returnModal" | "statusModal";

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
  // 동아리 사물함인 경우 title에 있는 동아리 이름 반환
  const { lentType, title, maxUser, lents } = selectedCabinetInfo;
  if (lentType === "CLUB" && title) return title;

  // 그 외에는 유저리스트 반환
  const userNameList = new Array(maxUser)
    .fill(null)
    .map((_, idx) => lents[idx])
    .map((info) => (info ? info.intraId : "-"))
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
    status === CabinetStatus.SET_EXPIRE_AVAILABLE ||
    status === CabinetStatus.SET_EXPIRE_FULL ||
    status === CabinetStatus.EXPIRED
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
    (status === CabinetStatus.SET_EXPIRE_FULL && lentType !== "CLUB") ||
    status === CabinetStatus.EXPIRED
  )
    return calExpiredTime(new Date(lents[0].expiredAt)) < 0
      ? "var(--expired)"
      : "var(--black)";
  // 빈 사물함
  else return "var(--black)";
};

const CabinetInfoAreaContainer = (): JSX.Element => {
  const targetCabinetInfo = useRecoilValue(targetCabinetInfoState);
  const myCabinetInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const { closeCabinet, toggleLent } = useMenu();
  const { isMultiSelect, targetCabinetInfoList } = useMultiSelect();
  const { isSameStatus, isSameType } = useMultiSelect();
  const isAdmin = document.location.pathname.indexOf("/admin") > -1;
  const [userModal, setUserModal] = useState<ICurrentModalStateInfo>({
    lentModal: false,
    unavailableModal: false,
    returnModal: false,
    memoModal: false,
    passwordCheckModal: false,
  });
  const [adminModal, setAdminModal] = useState<IAdminCurrentModalStateInfo>({
    returnModal: false,
    statusModal: false,
  });

  const cabinetViewData: ISelectedCabinetInfo | null = targetCabinetInfo
    ? {
        floor: targetCabinetInfo.floor,
        section: targetCabinetInfo.section,
        cabinetId: targetCabinetInfo.cabinetId,
        cabinetNum: targetCabinetInfo.visibleNum,
        status: targetCabinetInfo.status,
        lentType: targetCabinetInfo.lentType,
        userNameList: getCabinetUserList(targetCabinetInfo),
        expireDate: targetCabinetInfo.lents[0]?.expiredAt,
        detailMessage: getDetailMessage(targetCabinetInfo),
        detailMessageColor: getDetailMessageColor(targetCabinetInfo),
        isAdmin: isAdmin,
        isLented: targetCabinetInfo.lents.length !== 0,
      }
    : null;

  const countTypes = (cabinetList: CabinetInfo[]) =>
    cabinetList.reduce(
      (result, cabinet): ICount => {
        if (cabinet.status === CabinetStatus.SET_EXPIRE_AVAILABLE)
          result["AVAILABLE"]++;
        else if (cabinet.status === CabinetStatus.BANNED) result["BROKEN"]++;
        else result[cabinet.status]++;
        return result;
      },
      { AVAILABLE: 0, SET_EXPIRE_FULL: 0, EXPIRED: 0, BROKEN: 0 }
    );

  const multiSelectInfo: IMultiSelectTargetInfo | null = isMultiSelect
    ? {
        targetCabinetInfoList: targetCabinetInfoList,
        typeCounts: countTypes(targetCabinetInfoList),
      }
    : null;

  const openModal = (modalName: TModalState) => {
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

  const checkMultiReturn = (selectedCabinets: CabinetInfo[]) => {
    const returnable = selectedCabinets.find(
      (cabinet) => cabinet.lents.length >= 1
    );
    if (returnable !== undefined) {
      return true;
    }
    return false;
  };

  const checkMultiStatus = (selectedCabinets: CabinetInfo[]) => {
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
      {cabinetViewData && <AdminCabinetLentLogContainer />}
    </>
  ) : (
    <CabinetInfoArea
      selectedCabinetInfo={cabinetViewData}
      closeCabinet={closeCabinet}
      expireDate={setExpireDate(cabinetViewData?.expireDate)}
      isMine={myCabinetInfo?.cabinetId === cabinetViewData?.cabinetId}
      isAvailable={
        cabinetViewData?.status === "AVAILABLE" ||
        cabinetViewData?.status === "SET_EXPIRE_AVAILABLE"
      }
      userModal={userModal}
      openModal={openModal}
      closeModal={closeModal}
    />
  );
};

export default CabinetInfoAreaContainer;
