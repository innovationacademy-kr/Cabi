import { useRecoilValue } from "recoil";
import { targetUserInfoState } from "@/Cabinet/recoil/atoms";
import AdminLentLog from "@/Cabinet/components/LentLog/AdminLentLog";
import UserCabinetInfoArea, {
  ISelectedUserInfo,
} from "@/Cabinet/components/UserCabinetInfoArea/UserCabinetInfoArea";
import useMenu from "@/Cabinet/hooks/useMenu";

const UserCabinetInfoAreaContainer = (): JSX.Element => {
  const targetUserInfo = useRecoilValue(targetUserInfoState);
  const { closeCabinet, openLent } = useMenu();

  const userInfoData: ISelectedUserInfo | undefined = targetUserInfo
    ? {
        name: targetUserInfo.name,
        userId: targetUserInfo.userId,
        isBanned: !!targetUserInfo.bannedAt,
      }
    : undefined;

  return (
    <>
      <UserCabinetInfoArea
        selectedUserInfo={userInfoData}
        closeCabinet={closeCabinet}
        openLent={openLent}
      />
      {userInfoData && <AdminLentLog lentType={"USER"} />}
    </>
  );
};

export default UserCabinetInfoAreaContainer;
