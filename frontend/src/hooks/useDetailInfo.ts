const useDetailInfo = () => {
  const closeLeftNav = () => {
    document.getElementById("menuBg")?.classList.remove("on");
    document.getElementById("leftNavWrap")?.classList.remove("on");
  };

  const clickMap = () => {
    closeCabinet();
    closeLeftNav();
    if (document.getElementById("mapInfo")?.classList.contains("on") == true) {
      closeMap();
    } else {
      openMap();
    }
  };

  const openMap = () => {
    document.getElementById("mapInfo")?.classList.add("on");
    document.getElementById("menuBg")?.classList.add("on");
  };

  const closeMap = () => {
    document.getElementById("mapInfo")?.classList.remove("on");
    document.getElementById("mapFloorOptionBox")?.classList.remove("on");
    document.getElementById("menuBg")?.classList.remove("on");
  };

  const clickCabinet = () => {
    closeMap();
    closeLeftNav();
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
    document.getElementById("cabinetDetailArea")?.classList.add("on");
    document.getElementById("menuBg")?.classList.add("on");
  };

  const closeCabinet = () => {
    document.getElementById("cabinetDetailArea")?.classList.remove("on");
    document.getElementById("menuBg")?.classList.remove("on");
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
    closeLeftNav,
  };
};
export default useDetailInfo;
