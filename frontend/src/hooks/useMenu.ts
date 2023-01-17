import { useResetRecoilState } from "recoil";
import { currentCabinetIdState, targetCabinetInfoState } from "@/recoil/atoms";

const useMenu = () => {
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);

  const toggleLeftNav = () => {
    if (
      document.getElementById("leftNavWrap")?.classList.contains("on") == true
    ) {
      closeLeftNav();
    } else {
      openLeftNav();
    }
  };

  const openLeftNav = () => {
    closeCabinet();
    closeMap();
    document.getElementById("menuBg")?.classList.add("on");
    document.getElementById("leftNavWrap")?.classList.add("on");
  };

  const closeLeftNav = () => {
    if (
      document.getElementById("leftNavWrap")?.classList.contains("on") == true
    ) {
      document.getElementById("menuBg")?.classList.remove("on");
      document.getElementById("leftNavWrap")?.classList.remove("on");
    }
  };

  const toggleMap = () => {
    if (document.getElementById("mapInfo")?.classList.contains("on") == true) {
      closeMap();
    } else {
      openMap();
    }
  };

  const openMap = () => {
    closeLeftNav();
    closeCabinet();
    document.getElementById("mapInfo")?.classList.add("on");
    document.getElementById("menuBg")?.classList.add("on");
  };

  const closeMap = () => {
    if (document.getElementById("mapInfo")?.classList.contains("on") == true) {
      document.getElementById("mapInfo")?.classList.remove("on");
      document.getElementById("mapFloorOptionBox")?.classList.remove("on");
      document.getElementById("menuBg")?.classList.remove("on");
    }
  };

  const toggleCabinet = () => {
    if (
      document.getElementById("cabinetDetailArea")?.classList.contains("on") ==
      true
    ) {
      closeCabinet();
    } else {
      openCabinet();
    }
  };

  const openCabinet = () => {
    closeLeftNav();
    closeMap();
    document.getElementById("cabinetDetailArea")?.classList.add("on");
    document.getElementById("menuBg")?.classList.add("on");
  };

  const closeCabinet = () => {
    if (
      document.getElementById("cabinetDetailArea")?.classList.contains("on") ==
      true
    ) {
      resetTargetCabinetInfo();
      resetCurrentCabinetId();
      document.getElementById("cabinetDetailArea")?.classList.remove("on");
      document.getElementById("menuBg")?.classList.remove("on");
    }
  };

  const closeAll = () => {
    closeLeftNav();
    closeCabinet();
    closeMap();
  };

  return {
    toggleLeftNav,
    openLeftNav,
    closeLeftNav,
    toggleMap,
    openMap,
    closeMap,
    toggleCabinet,
    openCabinet,
    closeCabinet,
    closeAll,
  };
};

export default useMenu;
