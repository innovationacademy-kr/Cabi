import { axiosCabinetByLocationFloor } from "@/api/axios/axios.custom";
import { removeCookie } from "@/api/react_cookie/cookies";
import useIsMount from "@/hooks/useIsMount";
import {
  currentFloorCabinetState,
  currentFloorNumberState,
  currentLocationNameState,
  currentSectionNameState,
  isCurrentSectionRenderState,
  userState,
} from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import { CabinetInfoByLocationFloorDto } from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import LeftMainNav from "@/components/LeftNav/LeftMainNav/LeftMainNav";

const LeftMainNavContainer = () => {
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
  }, [currentLocation, currentFloor, myInfo.cabinet_id]);

  const onClickFloorButton = (floor: number) => {
    setCurrentFloor(floor);
    if (pathname == "/home") {
      if (floor === currentFloor) {
        axiosCabinetByLocationFloor(currentLocation, currentFloor).then(
          (response) => {
            setCurrentFloorData(response.data);
            setCurrentSection(response.data[0].section);
          }
        );
      }
      navigator("/main");
    }
  };

  const onClickHomeButton = () => {
    navigator("/home");
  };

  const onClickLogoutButton = (): void => {
    if (import.meta.env.VITE_IS_LOCAL === "true") {
      removeCookie("access_token");
    } else {
      removeCookie("access_token", { path: "/", domain: "cabi.42seoul.io" });
    }
    resetLocation();
    resetCurrentFloor();
    resetCurrentSection();
    navigator("/login");
  };
  return (
    <LeftMainNav
      pathname={pathname}
      floors={floors}
      currentFloor={currentFloor}
      onClickHomeButton={onClickHomeButton}
      onClickFloorButton={onClickFloorButton}
      onClickLogoutButton={onClickLogoutButton}
    />
  );
};

export default LeftMainNavContainer;
