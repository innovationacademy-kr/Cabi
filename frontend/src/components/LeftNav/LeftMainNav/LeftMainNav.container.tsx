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
  myCabinetInfoState,
  numberOfAdminWorkState,
} from "@/recoil/atoms";
import { currentBuildingFloorState } from "@/recoil/selectors";
import LeftMainNav from "@/components/LeftNav/LeftMainNav/LeftMainNav";
import {
  CabinetInfoByBuildingFloorDto,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import { axiosCabinetByBuildingFloor } from "@/api/axios/axios.custom";
import { removeCookie } from "@/api/react_cookie/cookies";
import useMenu from "@/hooks/useMenu";

const LeftMainNavContainer = ({ isAdmin }: { isAdmin?: boolean }) => {
  const currentBuildingName = useRecoilValue(currentBuildingNameState);
  const floors = useRecoilValue<Array<number>>(currentBuildingFloorState);
  const [currentFloor, setCurrentFloor] = useRecoilState<number>(
    currentFloorNumberState
  );
  const currentBuilding = useRecoilValue<string>(currentBuildingNameState);
  const setCurrentMapFloor = useSetRecoilState<number>(currentMapFloorState);
  const myCabinetInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
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
  }, [
    currentBuilding,
    currentFloor,
    myCabinetInfo?.cabinetId,
    numberOfAdminWork,
    myCabinetInfo?.status,
  ]);

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

  const onClickSearchButton = () => {
    navigator("search");
    closeAll();
  };

  const onClickAdminClubButton = () => {
    navigator("club");
    closeAll();
  };

  const onClickMainClubButton = () => {
    navigator("clubs");
    closeAll();
  };

  const onClickProfileButton = () => {
    navigator("profile");
    closeAll();
  };

  const onClickAvailableButton = () => {
    navigator("available");
    closeAll();
  };

  const onClickPresentationHomeButton = () => {
    navigator("home");
    closeAll();
  };

  const onClickPresentationRegisterButton = () => {
    navigator("register");
    closeAll();
  };

  const onClickPresentationDetailButton = () => {
    if (isAdmin) {
      navigator("presentation/detail");
    } else {
      navigator("detail");
    }
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
      currentBuildingName={currentBuildingName}
      floors={floors}
      currentFloor={currentFloor}
      onClickHomeButton={onClickHomeButton}
      onClickFloorButton={onClickFloorButton}
      onClickSearchButton={onClickSearchButton}
      onClickLogoutButton={onClickLogoutButton}
      onClickAdminClubButton={onClickAdminClubButton}
      onClickMainClubButton={onClickMainClubButton}
      onClickProfileButton={onClickProfileButton}
      onClickAvailableButton={onClickAvailableButton}
      onClickPresentationHomeButton={onClickPresentationHomeButton}
      onClickPresentationRegisterButton={onClickPresentationRegisterButton}
      onClickPresentationDetailButton={onClickPresentationDetailButton}
      isAdmin={isAdmin}
    />
  );
};

export default LeftMainNavContainer;
