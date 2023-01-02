import {
  toggleCabinetInfoState,
  toggleMapInfoState,
  toggleNavState,
} from "@/recoil/atoms";
import { useRecoilState } from "recoil";

const useDetailInfo = () => {
  const [toggleMyCabinet, toggleMyCabinetState] = useRecoilState(
    toggleCabinetInfoState
  );
  const [toggleMap, toggleMapState] = useRecoilState(toggleMapInfoState);
  const [toggleNav, setToggleNav] = useRecoilState(toggleNavState);

  const leftNavBg = document.getElementById("leftNavBg");
  const leftNavWrap = document.getElementById("leftNavWrap");
  const mapInfo = document.getElementById("mapInfo");
  const cabinetDetailArea = document.getElementById("cabinetDetailArea");

  const closeLeftNav = () => {
    if (toggleNav == true) {
      leftNavBg!.classList.remove("on");
      leftNavWrap!.classList.remove("on");
      setToggleNav(false);
    }
  };

  const clickMap = () => {
    if (toggleMap == true) {
      closeMap();
    } else {
      openMap();
    }
    closeCabinet();
    closeLeftNav();
  };

  const openMap = () => {
    if (toggleMap == false) {
      mapInfo!.classList.add("on");
      toggleMapState(true);
    }
  };

  const closeMap = () => {
    if (toggleMap == true) {
      mapInfo!.classList.remove("on");
      toggleMapState(false);
    }
  };

  const clickCabinet = () => {
    if (toggleMyCabinet == true) {
      closeCabinet();
    } else {
      openCabinet();
    }
    closeMap();
    closeLeftNav();
  };

  const openCabinet = () => {
    if (toggleMyCabinet == false) {
      cabinetDetailArea!.classList.add("on");
      toggleMyCabinetState(true);
    }
  };

  const closeCabinet = () => {
    if (toggleMyCabinet == true) {
      cabinetDetailArea!.classList.remove("on");
      toggleMyCabinetState(false);
    }
  };

  const closeDetailInfo = () => {
    closeCabinet();
    closeMap();
  };

  return {
    clickMap,
    openMap,
    closeMap,
    clickCabinet,
    openCabinet,
    closeCabinet,
    closeDetailInfo,
  };
};
export default useDetailInfo;
