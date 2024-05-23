import { useRecoilState } from "recoil";
import { targetUserInfoState } from "@/Cabinet/recoil/atoms";
import AdminLentLog from "@/Cabinet/components/LentLog/AdminLentLog";
import UserStoreInfoArea from "@/Cabinet/components/Store/Admin/UserStoreInfoArea/UserStoreInfoArea";
import useMenu from "@/Cabinet/hooks/useMenu";

export interface ISelectedUserStoreInfo {
  name: string;
  userId: number | null;
}

const UserStoreInfoAreaContainer = (): JSX.Element => {
  const [targetUserInfo] = useRecoilState(targetUserInfoState);
  const { openUserStore, closeCabinet } = useMenu();

  const userInfoData: ISelectedUserStoreInfo | undefined = targetUserInfo
    ? {
        name: targetUserInfo.name,
        userId: targetUserInfo.userId,
      }
    : undefined;

  return (
    <>
      <UserStoreInfoArea
        selectedUserInfo={userInfoData}
        openUserStore={openUserStore}
        closeCabinet={closeCabinet}
      />
      {userInfoData && <AdminLentLog lentType={"USER"} />}
    </>
  );
};

export default UserStoreInfoAreaContainer;
