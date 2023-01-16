import useDetailInfo from "@/hooks/useDetailInfo";

const useLeftNav = () => {
  const { closeDetailInfo } = useDetailInfo();

  const clickLeftNav = () => {
    if (
      document.getElementById("leftNavWrap")?.classList.contains("on") == true
    ) {
      closeLeftNav();
    } else {
      openLeftNav();
    }
  };

  const openLeftNav = () => {
    closeDetailInfo();
    document.getElementById("menuBg")?.classList.add("on");
    document.getElementById("leftNavWrap")?.classList.add("on");
  };

  const closeLeftNav = () => {
    document.getElementById("menuBg")?.classList.remove("on");
    document.getElementById("leftNavWrap")?.classList.remove("on");
  };
  return { openLeftNav, closeLeftNav, clickLeftNav };
};
export default useLeftNav;
