import { useRecoilValue } from "recoil";
import { targetUserInfoState } from "@/recoil/atoms";
import AdminLentLog from "@/components/LentLog/AdminLentLog";
import UserInfoArea, {
  ISelectedUserInfo,
} from "@/components/UserInfoArea/UserInfoArea";
import useMenu from "@/hooks/useMenu";

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
  console.log(userInfoData);

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
