import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  currentFloorCabinetState,
  currentFloorNumberState,
  currentLocationNameState,
  currentSectionNameState,
  isCurrentSectionRenderState,
  numberOfAdminWorkState,
  userState,
} from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import LeftMainNav from "@/components/LeftNav/LeftMainNav/LeftMainNav";
import { CabinetInfoByLocationFloorDto } from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import { removeCookie } from "@/api/react_cookie/cookies";
import { axiosCabinetByLocationFloor } from "@/api/axios/axios.custom";
import useIsMount from "@/hooks/useIsMount";
import useMenu from "@/hooks/useMenu";

const LeftMainNavContainer = ({ isAdmin }: { isAdmin?: boolean }) => {
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const [currentFloor, setCurrentFloor] = useRecoilState<number>(
    currentFloorNumberState
  );
  const currentLocation = useRecoilValue<string>(currentLocationNameState);
  const myInfo = useRecoilValue<UserDto>(userState);
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const resetLocation = useResetRecoilState(currentLocationNameState);
  const setCurrentFloorData = useSetRecoilState<
    CabinetInfoByLocationFloorDto[]
  >(currentFloorCabinetState);
  const setCurrentSection = useSetRecoilState<string>(currentSectionNameState);
  const numberOfAdminWork = useRecoilValue<number>(numberOfAdminWorkState);
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const isMount = useIsMount();
  const [isCurrentSectionRender, setIsCurrentSectionRender] = useRecoilState(
    isCurrentSectionRenderState
  );

  useEffect(() => {
    if (currentFloor === undefined) return;
    axiosCabinetByLocationFloor(currentLocation, currentFloor)
      .then((response) => {
        setCurrentFloorData(response.data);
        if (isMount || isCurrentSectionRender) {
          const recoilPersist = localStorage.getItem("recoil-persist");
          let recoilPersistObj;
          if (recoilPersist) recoilPersistObj = JSON.parse(recoilPersist);
          setCurrentSection(
            Object.keys(recoilPersistObj).includes("CurrentSection")
              ? recoilPersistObj.CurrentSection
              : response.data[0].section
          );
          setIsCurrentSectionRender(false);
        } else {
          setCurrentSection(response.data[0].section);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentLocation, currentFloor, myInfo.cabinet_id, numberOfAdminWork]);

  const onClickFloorButton = (floor: number) => {
    setCurrentFloor(floor);
    if (!pathname.includes("main")) {
      if (floor === currentFloor) {
        axiosCabinetByLocationFloor(currentLocation, currentFloor).then(
          (response) => {
            setCurrentFloorData(response.data);
            setCurrentSection(response.data[0].section);
          }
        );
      }
      navigator("main");
    }
  };

  const { closeAll } = useMenu();

  const onClickHomeButton = () => {
    navigator("home");
    closeAll();
  };

  const onClickLentLogButton = () => {
    navigator("log");
    closeAll();
  };

  const onClickSearchButton = () => {
    navigator("search");
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
    resetLocation();
    resetCurrentFloor();
    resetCurrentSection();
    navigator("login");
  };
  return (
    <LeftMainNav
      pathname={pathname}
      floors={floors}
      currentFloor={currentFloor}
      onClickHomeButton={onClickHomeButton}
      onClickFloorButton={onClickFloorButton}
      onClickLentLogButton={onClickLentLogButton}
      onClickSearchButton={onClickSearchButton}
      onClickLogoutButton={onClickLogoutButton}
      isAdmin={isAdmin}
    />
  );
};

export default LeftMainNavContainer;
