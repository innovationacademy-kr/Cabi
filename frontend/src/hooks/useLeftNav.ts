import useDetailInfo from "@/hooks/useDetailInfo";

const useLeftNav = () => {
  const { closeDetailInfo } = useDetailInfo();

  const clickLeftNav = () => {
    if (
      document.getElementById("leftNavBg")?.classList.contains("on") == true
    ) {
      closeLeftNav();
    } else {
      openLeftNav();
    }
  };

  const openLeftNav = () => {
    document.getElementById("leftNavBg")?.classList.add("on");
    document.getElementById("leftNavWrap")?.classList.add("on");
    closeDetailInfo();
  };

  const closeLeftNav = () => {
    document.getElementById("leftNavBg")?.classList.remove("on");
    document.getElementById("leftNavWrap")?.classList.remove("on");
  };
  return { openLeftNav, closeLeftNav, clickLeftNav };
};
export default useLeftNav;
