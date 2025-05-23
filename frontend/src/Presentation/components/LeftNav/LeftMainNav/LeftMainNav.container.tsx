import { HttpStatusCode } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import {
  currentBuildingNameState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/Cabinet/recoil/atoms";
import { axiosLogout } from "@/Cabinet/api/axios/axios.custom";
import { setLocalStorageItem } from "@/Cabinet/api/local_storage/local.storage";
import { removeCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";
import { getDomain } from "@/Cabinet/utils/domainUtils";
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
        removeCookie("access_token", {
          path: "/",
          domain: getDomain(),
        });
        setLocalStorageItem("isLoggedOut", "true");
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
