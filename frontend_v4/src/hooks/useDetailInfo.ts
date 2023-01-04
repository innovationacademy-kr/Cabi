const useDetailInfo = () => {
  const leftNavBg = document.getElementById("leftNavBg");
  const leftNavWrap = document.getElementById("leftNavWrap");
  const mapInfo = document.getElementById("mapInfo");
  const cabinetDetailArea = document.getElementById("cabinetDetailArea");
  const mapFloorOptionBox = document.getElementById("mapFloorOptionBox");

  const closeLeftNav = () => {
    leftNavBg?.classList.remove("on");
    leftNavWrap?.classList.remove("on");
  };

  const clickMap = () => {
    if (mapInfo?.classList.contains("on") == true) {
      closeMap();
    } else {
      openMap();
    }
    closeCabinet();
    closeLeftNav();
  };

  const openMap = () => {
    mapInfo?.classList.add("on");
  };

  const closeMap = () => {
    mapInfo?.classList.remove("on");
    mapFloorOptionBox?.classList.remove("on");
  };

  const clickCabinet = () => {
    cabinetDetailArea?.classList.toggle("on");
    closeMap();
    closeLeftNav();
  };

  const openCabinet = () => {
    cabinetDetailArea?.classList.add("on");
  };

  const closeCabinet = () => {
    cabinetDetailArea?.classList.remove("on");

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
