import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import {
  currentBuildingNameState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/Cabinet/recoil/atoms";
import ProfileCard from "@/Cabinet/components/Card/ProfileCard/ProfileCard";
import { axiosLogout } from "@/Cabinet/api/axios/axios.custom";
import { removeCookie } from "@/Cabinet/api/react_cookie/cookies";

const ProfileCardContainer = ({ name }: { name: string | null }) => {
  const navigator = useNavigate();
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const resetBuilding = useResetRecoilState(currentBuildingNameState);

  const onClickLogoutButton = async (): Promise<void> => {
    try {
      await axiosLogout();
      if (import.meta.env.VITE_IS_LOCAL === "true") {
        removeCookie("access_token", {
          path: "/",
          domain: "localhost",
        });
      } else {
        removeCookie("access_token", {
          path: "/",
          domain: "cabi.42seoul.io",
        });
      }
      resetBuilding();
      resetCurrentFloor();
      resetCurrentSection();
      navigator("/login");
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
