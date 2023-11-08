import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import {
  currentBuildingNameState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/recoil/atoms";
import ProfileCard from "@/components/Card/ProfileCard/ProfileCard";
import { removeCookie } from "@/api/react_cookie/cookies";

const ProfileCardContainer = ({ name }: { name: string | null }) => {
  const navigator = useNavigate();
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const resetBuilding = useResetRecoilState(currentBuildingNameState);

  const onClickLogoutButton = (): void => {
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
