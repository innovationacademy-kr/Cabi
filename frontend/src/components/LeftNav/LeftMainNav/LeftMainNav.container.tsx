import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  currentBuildingNameState,
  currentFloorCabinetState,
  currentFloorNumberState,
  currentMapFloorState,
  currentSectionNameState,
  numberOfAdminWorkState,
  userState,
} from "@/recoil/atoms";
import { currentBuildingFloorState } from "@/recoil/selectors";
import LeftMainNav from "@/components/LeftNav/LeftMainNav/LeftMainNav";
import { CabinetInfoByBuildingFloorDto } from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import { axiosCabinetByBuildingFloor } from "@/api/axios/axios.custom";
import { removeCookie } from "@/api/react_cookie/cookies";
import useMenu from "@/hooks/useMenu";

const LeftMainNavContainer = ({ isAdmin }: { isAdmin?: boolean }) => {
  const floors = useRecoilValue<Array<number>>(currentBuildingFloorState);
  const [currentFloor, setCurrentFloor] = useRecoilState<number>(
    currentFloorNumberState
  );
  const currentBuilding = useRecoilValue<string>(currentBuildingNameState);
  const setCurrentMapFloor = useSetRecoilState<number>(currentMapFloorState);
  const myInfo = useRecoilValue<UserDto>(userState);
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const resetBuilding = useResetRecoilState(currentBuildingNameState);
  const setCurrentFloorData = useSetRecoilState<
    CabinetInfoByBuildingFloorDto[]
  >(currentFloorCabinetState);
  const setCurrentSection = useSetRecoilState<string>(currentSectionNameState);
  const numberOfAdminWork = useRecoilValue<number>(numberOfAdminWorkState);
  const navigator = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (currentFloor === undefined) {
      setCurrentMapFloor(floors[0]);
      return;
    }
    axiosCabinetByBuildingFloor(currentBuilding, currentFloor)
      .then((response) => {
        setCurrentFloorData(response.data);
        const sections = response.data.map(
          (data: CabinetInfoByBuildingFloorDto) => data.section
        );
        let currentSectionFromPersist = undefined;
        const recoilPersist = localStorage.getItem("recoil-persist");
        if (recoilPersist) {
          const recoilPersistObj = JSON.parse(recoilPersist);
          if (Object.keys(recoilPersistObj).includes("CurrentSection")) {
            currentSectionFromPersist = recoilPersistObj.CurrentSection;
          }
        }
        currentSectionFromPersist &&
        sections.includes(currentSectionFromPersist)
          ? setCurrentSection(currentSectionFromPersist)
          : setCurrentSection(response.data[0].section);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentBuilding, currentFloor, myInfo.cabinetId, numberOfAdminWork]);

  const onClickFloorButton = (floor: number) => {
    setCurrentFloor(floor);
    setCurrentMapFloor(floor);
    if (!pathname.includes("main")) {
      if (floor === currentFloor) {
        axiosCabinetByBuildingFloor(currentBuilding, currentFloor).then(
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

  const onClickClubButton = () => {
    navigator("club");
    closeAll();
  };

  const onClickProfileButton = () => {
    navigator("profile");
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
      onClickClubButton={onClickClubButton}
      onClickProfileButton={onClickProfileButton}
      isAdmin={isAdmin}
    />
  );
};

export default LeftMainNavContainer;
