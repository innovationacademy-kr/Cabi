import { useRecoilValue } from "recoil";
import { targetUserInfoState } from "@/Cabinet/recoil/atoms";
import AdminLentLog from "@/Cabinet/components/LentLog/AdminLentLog";
import UserInfoArea, {
  ISelectedUserInfo,
} from "@/Cabinet/components/UserInfoArea/UserInfoArea";
import useMenu from "@/Cabinet/hooks/useMenu";

const UserInfoAreaContainer = (): JSX.Element => {
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
      <UserInfoArea
        selectedUserInfo={userInfoData}
        closeCabinet={closeCabinet}
        openLent={openLent}
      />
      {userInfoData && <AdminLentLog lentType={"USER"} />}
    </>
  );
};

export default UserInfoAreaContainer;
