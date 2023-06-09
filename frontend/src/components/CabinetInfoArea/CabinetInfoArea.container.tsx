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
  // 동아리 사물함인 경우 cabinet_title에 있는 동아리 이름 반환
  const { lent_type, cabinet_title, max_user, lent_info } = selectedCabinetInfo;
  if (lent_type === "CLUB" && cabinet_title) return cabinet_title;

  // 그 외에는 유저리스트 반환
  const userNameList = new Array(max_user)
    .fill(null)
    .map((_, idx) => lent_info[idx])
    .map((info) => (info ? info.intra_id : "-"))
    .join("\n");
  return userNameList;
};

const getDetailMessage = (selectedCabinetInfo: CabinetInfo): string | null => {
  const { status, lent_type, lent_info } = selectedCabinetInfo;
  // 밴, 고장 사물함
  if (status === CabinetStatus.BANNED || status === CabinetStatus.BROKEN)
    return "사용 불가";
  // 동아리 사물함
  else if (lent_type === "CLUB") return "동아리 사물함";
  // 사용 중 사물함
  else if (
    status === CabinetStatus.SET_EXPIRE_AVAILABLE ||
    status === CabinetStatus.SET_EXPIRE_FULL ||
    status === CabinetStatus.EXPIRED
  )
    return getCalcualtedTimeString(new Date(lent_info[0].expire_time));
  // 빈 사물함
  else return null;
};

const getDetailMessageColor = (selectedCabinetInfo: CabinetInfo): string => {
  const { status, lent_type, lent_info } = selectedCabinetInfo;
  // 밴, 고장 사물함
  if (status === CabinetStatus.BANNED || status === CabinetStatus.BROKEN)
    return "var(--expired)";
  // 사용 중 사물함
  else if (
    (status === CabinetStatus.SET_EXPIRE_FULL && lent_type !== "CLUB") ||
    status === CabinetStatus.EXPIRED
  )
    return calExpiredTime(new Date(lent_info[0].expire_time)) < 0
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
        cabinetId: targetCabinetInfo.cabinet_id,
        cabinetNum: targetCabinetInfo.cabinet_num,
        status: targetCabinetInfo.status,
        lentType: targetCabinetInfo.lent_type,
        userNameList: getCabinetUserList(targetCabinetInfo),
        expireDate: targetCabinetInfo.lent_info[0]?.expire_time,
        detailMessage: getDetailMessage(targetCabinetInfo),
        detailMessageColor: getDetailMessageColor(targetCabinetInfo),
        isAdmin: isAdmin,
        isLented: targetCabinetInfo.lent_info.length !== 0,
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

  const currentlyOpenedModal = (modalName: TModalState, toggle: boolean) => {
    setUserModal({
      ...userModal,
      [modalName]: toggle,
    });
  };

  const currentlyOpenedAdminModal = (
    modalName: TAdminModalState,
    toggle: boolean
  ) => {
    setAdminModal({
      ...adminModal,
      [modalName]: toggle,
    });
  };

  const checkMultiReturn = (selectedCabinets: CabinetInfo[]) => {
    const returnable = selectedCabinets.find(
      (cabinet) => cabinet.lent_info.length >= 1
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
        currentlyOpenedModal={currentlyOpenedAdminModal}
        checkMultiReturn={checkMultiReturn}
        checkMultiStatus={checkMultiStatus}
      />
      {cabinetViewData && <AdminCabinetLentLogContainer />}
    </>
  ) : (
    <CabinetInfoArea
      selectedCabinetInfo={cabinetViewData}
      closeCabinet={closeCabinet}
      expireDate={setExpireDate(cabinetViewData?.expireDate)}
      isMine={myCabinetInfo?.cabinet_id === cabinetViewData?.cabinetId}
      isAvailable={
        cabinetViewData?.status === "AVAILABLE" ||
        cabinetViewData?.status === "SET_EXPIRE_AVAILABLE"
      }
      userModal={userModal}
      currentlyOpenedModal={currentlyOpenedModal}
    />
  );
};

export default CabinetInfoAreaContainer;
