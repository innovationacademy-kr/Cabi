import { useRecoilValue } from "recoil";
import { myCabinetInfoState, targetCabinetInfoState } from "@/recoil/atoms";
import CabinetInfoArea, {
  ISelectedCabinetInfo,
} from "@/components/CabinetInfoArea/CabinetInfoArea";
import { CabinetInfo, MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import useMenu from "@/hooks/useMenu";
import useMultiSelect from "@/hooks/useMultiSelect";
import AdminCabinetInfoArea, {
  IMultiSelectTargetInfo,
} from "@/components/CabinetInfoArea/AdminCabinetInfoArea";
import AdminCabinetLentLogContainer from "@/components/LentLog/AdminCabinetLentLog.container";
import { useState } from "react";

const calExpiredTime = (expireTime: Date) =>
  Math.floor(
    (expireTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

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

interface ICount {
  AVAILABLE: number;
  SET_EXPIRE_FULL: number;
  EXPIRED: number;
  BROKEN: number;
}

export interface IUserModalState {
  lentModal: boolean;
  unavailableModal: boolean;
  returnModal: boolean;
  memoModal: boolean;
  passwordCheckModal: boolean;
}

export interface IAdminModalState {
  returnModal: boolean;
  statusModal: boolean;
}

const CabinetInfoAreaContainer = (): JSX.Element => {
  const targetCabinetInfo = useRecoilValue(targetCabinetInfoState);
  const myCabinetInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const { closeCabinet, toggleLent } = useMenu();
  const { isMultiSelect, targetCabinetInfoList } = useMultiSelect();
  const isAdmin = document.location.pathname.indexOf("/admin") > -1;
  const { resetMultiSelectMode, isSameStatus, isSameType } = useMultiSelect();

  const [userModal, setUserModal] = useState<IUserModalState>({
    lentModal: false,
    unavailableModal: false,
    returnModal: false,
    memoModal: false,
    passwordCheckModal: false,
  });
  const [adminModal, setAdminModal] = useState<IAdminModalState>({
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

  const handleAdminModal = (modalName: string, toggle: boolean) => {
    setAdminModal({
      ...adminModal,
      [modalName]: toggle,
    });
  };

  const checkMultiReturn = (multiSelectInfo: IMultiSelectTargetInfo | null) => {
    if (multiSelectInfo === null) return false;
    return multiSelectInfo.targetCabinetInfoList.some(
      (cabinet) => cabinet.lent_info.length >= 1
    );
  };

  const checkMultiStatus = (multiSelectInfo: IMultiSelectTargetInfo | null) => {
    if (
      multiSelectInfo === null ||
      multiSelectInfo.targetCabinetInfoList.length === 0
    )
      return false;
    return (
      isSameType(multiSelectInfo.targetCabinetInfoList) &&
      isSameStatus(multiSelectInfo.targetCabinetInfoList)
    );
  };

  const handleUserModal = (
    modalName: string,
    toggle: boolean,
    myCabinetId: number | undefined
  ) => {
    // if (myCabinetId) {
    //   setUserModal({
    //     ...userModal,
    //     unavailableModal: true,
    //     lentModal: true,
    //   });
    //   return;
    // }
    setUserModal({
      ...userModal,
      [modalName]: toggle,
    });
  };

  return isAdmin ? (
    <>
      <AdminCabinetInfoArea
        selectedCabinetInfo={cabinetViewData}
        closeCabinet={closeCabinet}
        multiSelectTargetInfo={multiSelectInfo}
        openLent={toggleLent}
        adminModal={adminModal}
        handleAdminModal={handleAdminModal}
        checkMultiReturn={checkMultiReturn(multiSelectInfo)}
        checkMultiStatus={checkMultiStatus(multiSelectInfo)}
        resetMultiSelectMode={resetMultiSelectMode}
      />
      {cabinetViewData && <AdminCabinetLentLogContainer />}
    </>
  ) : (
    <CabinetInfoArea
      selectedCabinetInfo={cabinetViewData}
      isMine={myCabinetInfo?.cabinet_id === cabinetViewData?.cabinetId}
      isAvailable={
        cabinetViewData?.status === "AVAILABLE" ||
        cabinetViewData?.status === "SET_EXPIRE_AVAILABLE"
      }
      closeCabinet={closeCabinet}
      userModal={userModal}
      handleUserModal={handleUserModal}
    />
  );
};

export default CabinetInfoAreaContainer;
