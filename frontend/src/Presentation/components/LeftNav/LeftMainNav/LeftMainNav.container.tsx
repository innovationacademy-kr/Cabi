import { HttpStatusCode } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import {
  currentBuildingNameState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/Cabinet/recoil/atoms";
import { axiosLogout } from "@/Cabinet/api/axios/axios.custom";
import { removeCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";
import LeftMainNav from "@/Presentation/components/LeftNav/LeftMainNav/LeftMainNav";

const LeftMainNavContainer = ({ isAdmin }: { isAdmin?: boolean }) => {
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const resetBuilding = useResetRecoilState(currentBuildingNameState);
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const { closeAll } = useMenu();

  const onClickPresentationHomeButton = () => {
    navigator("/presentation/home");
    closeAll();
  };

  const onClickPresentationRegisterButton = () => {
    navigator("/presentation/register");
    closeAll();
  };

  const onClickPresentationDetailButton = () => {
    if (isAdmin) {
      navigator("/admin/presentation/detail");
    } else {
      navigator("/presentation/detail");
    }
    closeAll();
  };

  const onClickPresentationLogButton = () => {
    navigator("/presentation/log");
    closeAll();
  };

  const onClickLogoutButton = async (): Promise<void> => {
    try {
      const response = await axiosLogout();
      if (response.status === HttpStatusCode.Ok) {
        const domain =
          import.meta.env.VITE_IS_LOCAL === "true"
            ? "localhost"
            : "cabi.42seoul.io";

        removeCookie("access_token", {
          path: "/",
          domain: domain,
        });
        resetBuilding();
        resetCurrentFloor();
        resetCurrentSection();
        const path = isAdmin ? "/admin/login" : "/login";
        navigator(path);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LeftMainNav
      pathname={pathname}
      onClickLogoutButton={onClickLogoutButton}
      onClickPresentationHomeButton={onClickPresentationHomeButton}
      onClickPresentationRegisterButton={onClickPresentationRegisterButton}
      onClickPresentationDetailButton={onClickPresentationDetailButton}
      onClickPresentationLogButton={onClickPresentationLogButton}
      isAdmin={isAdmin}
    />
  );
};

export default LeftMainNavContainer;
