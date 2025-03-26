import { HttpStatusCode } from "axios";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import {
  currentBuildingNameState,
  currentFloorNumberState,
  currentSectionNameState,
  myCabinetInfoState,
} from "@/Cabinet/recoil/atoms";
import ProfileCard from "@/Cabinet/components/Card/ProfileCard/ProfileCard";
import { axiosLogout } from "@/Cabinet/api/axios/axios.custom";
import { removeCookie } from "@/Cabinet/api/react_cookie/cookies";

const ProfileCardContainer = ({ name }: { name: string | null }) => {
  const navigator = useNavigate();
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const resetBuilding = useResetRecoilState(currentBuildingNameState);
  const resetMyLentInfo = useResetRecoilState(myCabinetInfoState);

  const onClickLogoutButton = async (): Promise<void> => {
    try {
      const response = await axiosLogout();

      if (response.status === HttpStatusCode.Ok) {
        localStorage.setItem("isLoggedOut", "true");

        const { provider } = response.data;

        if (provider === "google") {
          const googleAuth = gapi.auth2?.getAuthInstance();
          if (googleAuth) await googleAuth.signOut();
        } else if (provider === "ft") {
          const returnUrl = encodeURIComponent(`/login`);
          window.location.href = `https://profile.intra.42.fr/logout?return_to=${returnUrl}`;
        }
        // TODO : 다른 provider 로그아웃 처리
        removeCookie("access_token", {
          path: "/",
          domain:
            import.meta.env.VITE_IS_LOCAL === "true"
              ? "localhost"
              : "cabi.42seoul.io",
        });
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
