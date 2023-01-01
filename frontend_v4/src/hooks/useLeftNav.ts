import { toggleNavState } from "@/recoil/atoms";
import { useRecoilState } from "recoil";

const useLeftNav = () => {
  const [toggleNav, setToggleNav] = useRecoilState(toggleNavState);

  const closeLeftNav = () => {
    if (toggleNav == true) {
      document.getElementById("leftNavBg")!.classList.remove("on");
      document.getElementById("leftNavWrap")!.classList.remove("on");
      setToggleNav(false);
    }
  };
  return { closeLeftNav };
};
export default useLeftNav;
