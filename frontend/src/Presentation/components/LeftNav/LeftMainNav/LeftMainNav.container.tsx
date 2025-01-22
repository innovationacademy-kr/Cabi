import { useLocation, useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import {
  currentBuildingNameState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/Cabinet/recoil/atoms";
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

  const onClickLogoutButton = (): void => {
    const adminToken = isAdmin ? "admin_" : "";
    if (import.meta.env.VITE_IS_LOCAL === "true") {
      removeCookie(adminToken + "access_token", {
        path: "/",
        domain: "localhost",
      });
    } else {
      removeCookie(adminToken + "access_token", {
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
