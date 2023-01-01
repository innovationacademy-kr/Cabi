import { toggleNavState } from "@/recoil/atoms";
import { useRecoilState } from "recoil";
import useDetailInfo from "./useDetailInfo";

const useLeftNav = () => {
  const { closeDetailInfo } = useDetailInfo();
  const [toggleNav, setToggleNav] = useRecoilState(toggleNavState);
  const leftNavBg = document.getElementById("leftNavBg");
  const leftNavWrap = document.getElementById("leftNavWrap");

  const clickLeftNav = () => {
    if (toggleNav == false) {
      openLeftNav();
    } else {
      closeLeftNav();
    }
  };

  const openLeftNav = () => {
    if (toggleNav == false) {
      leftNavBg!.classList.add("on");
      leftNavWrap!.classList.add("on");
      setToggleNav(true);
      closeDetailInfo();
    }
  };

  const closeLeftNav = () => {
    if (toggleNav == true) {
      leftNavBg!.classList.remove("on");
      leftNavWrap!.classList.remove("on");
      setToggleNav(false);
    }
  };
  return { openLeftNav, closeLeftNav, clickLeftNav };
};
export default useLeftNav;
