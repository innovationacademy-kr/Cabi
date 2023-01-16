const useDetailInfo = () => {
  const closeLeftNav = () => {
    document.getElementById("leftNavBg")?.classList.remove("on");
    document.getElementById("leftNavWrap")?.classList.remove("on");
  };

  const clickMap = () => {
    if (document.getElementById("mapInfo")?.classList.contains("on") == true) {
      closeMap();
    } else {
      openMap();
    }
    closeCabinet();
    closeLeftNav();
  };

  const openMap = () => {
    document.getElementById("mapInfo")?.classList.add("on");
  };

  const closeMap = () => {
    document.getElementById("mapInfo")?.classList.remove("on");
    document.getElementById("mapFloorOptionBox")?.classList.remove("on");
  };

  const clickCabinet = () => {
    document.getElementById("cabinetDetailArea")?.classList.toggle("on");
    closeMap();
    closeLeftNav();
  };

  const openCabinet = () => {
    document.getElementById("cabinetDetailArea")?.classList.add("on");
  };

  const closeCabinet = () => {
    document.getElementById("cabinetDetailArea")?.classList.remove("on");
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
