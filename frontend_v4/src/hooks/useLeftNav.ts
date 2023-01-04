import useDetailInfo from "./useDetailInfo";

const useLeftNav = () => {
  const { closeDetailInfo } = useDetailInfo();
  const leftNavBg = document.getElementById("leftNavBg");
  const leftNavWrap = document.getElementById("leftNavWrap");

  const clickLeftNav = () => {
    if (leftNavBg?.classList.contains("on") == true) {
      closeLeftNav();
    } else {
      openLeftNav();
    }
  };

  const openLeftNav = () => {
    leftNavBg?.classList.add("on");
    leftNavWrap?.classList.add("on");
    closeDetailInfo();
  };

  const closeLeftNav = () => {
    leftNavBg?.classList.remove("on");
    leftNavWrap?.classList.remove("on");
  };
  return { openLeftNav, closeLeftNav, clickLeftNav };
};
export default useLeftNav;
