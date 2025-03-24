import { HttpStatusCode } from "axios";
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
  currentFloorSectionNamesState,
  currentMapFloorState,
  currentSectionNameState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  numberOfAdminWorkState,
  selectedTypeOnSearchState,
} from "@/Cabinet/recoil/atoms";
import { currentBuildingFloorState } from "@/Cabinet/recoil/selectors";
import LeftMainNav from "@/Cabinet/components/LeftNav/LeftMainNav/LeftMainNav";
import {
  CabinetInfoByBuildingFloorDto,
  MyCabinetInfoResponseDto,
} from "@/Cabinet/types/dto/cabinet.dto";
import CabinetDetailAreaType from "@/Cabinet/types/enum/cabinetDetailArea.type.enum";
import {
  axiosCabinetByBuildingFloor,
  axiosLogout,
} from "@/Cabinet/api/axios/axios.custom";
import { removeCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";

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
  const [isCurrentSectionRender] = useRecoilState(isCurrentSectionRenderState);
  const setSelectedTypeOnSearch = useSetRecoilState<CabinetDetailAreaType>(
    selectedTypeOnSearchState
  );
  const setCurrentFloorSectionNames = useSetRecoilState(
    currentFloorSectionNamesState
  );

  useEffect(() => {
    if (!currentFloor) {
      setCurrentMapFloor(floors[0]);
      return;
    }

    axiosCabinetByBuildingFloor(currentBuilding, currentFloor)
      .then((response) => {
        setCurrentFloorData(response.data);
        const sections = response.data.map(
          (data: CabinetInfoByBuildingFloorDto) => data.section
        );
        setCurrentFloorSectionNames(sections);
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
          : setCurrentSection(response.data[0]?.section);
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
    isCurrentSectionRender,
  ]);

  const onClickFloorButton = (floor: number) => {
    setCurrentFloor(floor);
    setCurrentMapFloor(floor);
    setSelectedTypeOnSearch(CabinetDetailAreaType.CABINET);
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

  const onClickSlackAlarmButton = () => {
    navigator("slack-alarm");
    closeAll();
  };

  const onClickStoreButton = (): void => {
    navigator("store");
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

  const onClickLogoutButton = async (): Promise<void> => {
    try {
      const response = await axiosLogout();
      if (response.status === HttpStatusCode.Ok) {
        localStorage.setItem("isLoggedOut", "true");

        if (import.meta.env.VITE_IS_LOCAL === "true") {
          removeCookie("admin_access_token", {
            path: "/",
            domain: "localhost",
          });
        } else {
          removeCookie("admin_access_token", {
            path: "/",
            domain: "cabi.42seoul.io",
          });
        }
        resetBuilding();
        resetCurrentFloor();
        resetCurrentSection();
        navigator("/admin/login");
      }
    } catch (error) {
      console.error(error);
    }
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
      onClickSlackAlarmButton={onClickSlackAlarmButton}
      onClickAdminClubButton={onClickAdminClubButton}
      onClickMainClubButton={onClickMainClubButton}
      onClickProfileButton={onClickProfileButton}
      onClickAvailableButton={onClickAvailableButton}
      onClickStoreButton={onClickStoreButton}
      isAdmin={isAdmin}
    />
  );
};

export default LeftMainNavContainer;
