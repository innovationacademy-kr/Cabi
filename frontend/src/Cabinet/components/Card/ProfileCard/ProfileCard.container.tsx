import { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import {
  currentBuildingNameState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/Cabinet/recoil/atoms";
import ProfileCard from "@/Cabinet/components/Card/ProfileCard/ProfileCard";
import { axiosLogout } from "@/Cabinet/api/axios/axios.custom";
import { setLocalStorageItem } from "@/Cabinet/api/local_storage/local.storage";
import { removeCookie } from "@/Cabinet/api/react_cookie/cookies";
import { getDomain } from "@/Cabinet/utils/domainUtils";

const ProfileCardContainer = ({ name }: { name: string | null }) => {
  const navigator = useNavigate();
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const resetBuilding = useResetRecoilState(currentBuildingNameState);

  const onClickLogoutButton = async (): Promise<void> => {
    try {
      const response = await axiosLogout();

      if (response.status === HttpStatusCode.Ok) {
        removeCookie("access_token", {
          path: "/",
          domain: getDomain(),
        });
        setLocalStorageItem("isLoggedOut", "true");
        resetBuilding();
        resetCurrentFloor();
        resetCurrentSection();
        navigator("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProfileCard
      name={name}
      button={{
        label: "로그아웃",
        onClick: onClickLogoutButton,
        isClickable: true,
      }}
    />
  );
};

export default ProfileCardContainer;
