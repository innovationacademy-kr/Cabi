import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentCabinetIdState, targetUserInfoState } from "@/recoil/atoms";
import AdminUserLentLogContainer from "@/components/LentLog/AdminUserLentLog.container";
import UserInfoArea, {
  ISelectedUserInfo,
  IUserLentInfo,
} from "@/components/UserInfoArea/UserInfoArea";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import useMenu from "@/hooks/useMenu";

const UserInfoAreaContainer = (): JSX.Element => {
  const targetUserInfo = useRecoilValue(targetUserInfoState);
  const setCurrentCabinetId = useSetRecoilState(currentCabinetIdState);
  const { closeCabinet, openLent } = useMenu();
  const getCabinetUserList = (selectedCabinetInfo: CabinetInfo): string => {
    // 동아리 사물함인 경우 title에 있는 동아리 이름 반환
    if (selectedCabinetInfo.lentType === "CLUB" && selectedCabinetInfo.title)
      return selectedCabinetInfo.title;

    // 그 외에는 유저리스트 반환
    let userNameList: string = "";
    for (let i = 0; i < selectedCabinetInfo.maxUser; i++) {
      const userName =
        i < selectedCabinetInfo.lents.length
          ? selectedCabinetInfo.lents[i].intraId
          : "-";
      userNameList += userName;
      if (i !== selectedCabinetInfo.maxUser - 1) userNameList += "\n";
    }
    return userNameList;
  };

  const getDetailMessage = (
    selectedCabinetInfo: CabinetInfo
  ): string | null => {
    // 밴, 고장 사물함
    if (
      selectedCabinetInfo.status === CabinetStatus.BANNED ||
      selectedCabinetInfo.status === CabinetStatus.BROKEN
    )
      return "사용 불가";
    // 동아리 사물함
    else if (selectedCabinetInfo.lentType === "CLUB") return "동아리 사물함";
    // 사용 중 사물함
    else if (
      selectedCabinetInfo.status === CabinetStatus.SET_EXPIRE_FULL ||
      selectedCabinetInfo.status === CabinetStatus.EXPIRED
    ) {
      const nowDate = new Date();
      const expireTime = new Date(selectedCabinetInfo.lents[0].expiredAt);
      const remainTime = Math.floor(
        (expireTime.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const remainTimeString =
        remainTime < 0
          ? `반납일이 ${-remainTime}일 지났습니다`
          : `반납일이 ${remainTime}일 남았습니다`;
      return remainTimeString;
      // 빈 사물함
    } else return null;
  };

  const getDetailMessageColor = (selectedCabinetInfo: CabinetInfo): string => {
    // 밴, 고장 사물함
    if (
      selectedCabinetInfo.status === CabinetStatus.BANNED ||
      selectedCabinetInfo.status === CabinetStatus.BROKEN
    )
      return "var(--expired)";
    // 사용 중 사물함
    else if (
      selectedCabinetInfo.status === CabinetStatus.SET_EXPIRE_FULL ||
      selectedCabinetInfo.status === CabinetStatus.EXPIRED
    ) {
      const nowDate = new Date();
      const expireTime = new Date(selectedCabinetInfo.lents[0].expiredAt);
      const remainTime = Math.floor(
        (expireTime.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return remainTime < 0 ? "var(--expired)" : "var(--black)";
      // 빈 사물함
    } else return "var(--black)";
  };

  if (targetUserInfo?.cabinetId) setCurrentCabinetId(targetUserInfo.cabinetId);

  const userInfoData: ISelectedUserInfo | undefined = targetUserInfo
    ? {
        intraId: targetUserInfo.intraId,
        userId: targetUserInfo.userId,
        isBanned: !!targetUserInfo.bannedDate,
      }
    : undefined;

  const userViewData: IUserLentInfo | undefined = targetUserInfo?.cabinetInfo
    ? {
        floor: targetUserInfo.cabinetInfo.floor,
        section: targetUserInfo.cabinetInfo.section,
        cabinetId: targetUserInfo.cabinetInfo.cabinetId,
        cabinetNum: targetUserInfo.cabinetInfo.visibleNum,
        status: targetUserInfo.cabinetInfo.status,
        lentType: targetUserInfo.cabinetInfo.lentType,
        userNameList: getCabinetUserList(targetUserInfo.cabinetInfo),
        expireDate: targetUserInfo.cabinetInfo.lents[0].expiredAt,
        detailMessage: getDetailMessage(targetUserInfo.cabinetInfo),
        detailMessageColor: getDetailMessageColor(targetUserInfo.cabinetInfo),
      }
    : undefined;

  // *

  return (
    <>
      <UserInfoArea
        selectedUserInfo={userInfoData}
        userLentInfo={userViewData}
        closeCabinet={closeCabinet}
        openLent={openLent}
      />
      {userInfoData && <AdminUserLentLogContainer />}
    </>
  );
};

export default UserInfoAreaContainer;
