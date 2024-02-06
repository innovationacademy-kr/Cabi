import { useResetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  currentIntraIdState,
  targetCabinetInfoState,
  targetClubUserInfoState,
  targetUserInfoState,
} from "@/recoil/atoms";

const useMenu = () => {
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetTargetUserInfo = useResetRecoilState(targetUserInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);
  const resetCurrentIntraId = useResetRecoilState(currentIntraIdState);
  const resetTargetClubUserInfo = useResetRecoilState(targetClubUserInfoState);

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
    closeLent();
    closeClubMember();
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

  const toggleLent = () => {
    if (document.getElementById("lentInfo")?.classList.contains("on") == true) {
      closeLent();
    } else {
      openLent();
    }
  };

  const openLent = () => {
    closeLeftNav();
    closeMap();
    document.getElementById("lentInfo")?.classList.add("on");
    document.getElementById("menuBg")?.classList.add("on");
  };

  const closeLent = () => {
    if (document.getElementById("lentInfo")?.classList.contains("on") == true) {
      document.getElementById("lentInfo")?.classList.remove("on");
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
    closeLent();
    closeClubMember();
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
    closeLent();
    closeClubMember();
    document.getElementById("cabinetDetailArea")?.classList.add("on");
    document.getElementById("menuBg")?.classList.add("on");
  };

  const closeCabinet = () => {
    closeLent();
    if (
      document.getElementById("cabinetDetailArea")?.classList.contains("on") ==
      true
    ) {
      resetTargetCabinetInfo();
      resetTargetUserInfo();
      resetCurrentCabinetId();
      resetCurrentIntraId();
      document.getElementById("cabinetDetailArea")?.classList.remove("on");
      document.getElementById("menuBg")?.classList.remove("on");
    }
  };

  const toggleClubMember = () => {
    if (
      document.getElementById("clubMemberInfoArea")?.classList.contains("on") ==
      true
    ) {
      closeClubMember();
    } else {
      openClubMember();
    }
  };

  const openClubMember = () => {
    closeLeftNav();
    closeMap();
    closeLent();
    closeCabinet();
    document.getElementById("clubMemberInfoArea")?.classList.add("on");
    document.getElementById("menuBg")?.classList.add("on");
  };

  const closeClubMember = () => {
    if (
      document.getElementById("clubMemberInfoArea")?.classList.contains("on") ==
      true
    ) {
      resetTargetClubUserInfo();
      document.getElementById("clubMemberInfoArea")?.classList.remove("on");
      document.getElementById("menuBg")?.classList.remove("on");
    }
  };

  const closeAll = () => {
    closeLeftNav();
    closeCabinet();
    closeLent();
    closeMap();
    closeClubMember();
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
    toggleLent,
    openLent,
    closeLent,
    toggleClubMember,
    openClubMember,
    closeClubMember,
  };
};

export default useMenu;
