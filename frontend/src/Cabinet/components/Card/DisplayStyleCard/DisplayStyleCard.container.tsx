import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { displayStyleState } from "@/Cabinet/recoil/atoms";
import DisplayStyleCard from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard";
import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";

// 로컬스토리지의 display-style-toggle 값에 따라 DisplayStyleType 반환
export const getInitialDisplayStyle = (
  displayStyleToggle: DisplayStyleToggleType,
  darkModeQuery: MediaQueryList
): DisplayStyleType => {
  //라이트 / 다크 버튼
  if (displayStyleToggle === DisplayStyleToggleType.LIGHT) {
    return DisplayStyleType.LIGHT;
  } else if (displayStyleToggle === DisplayStyleToggleType.DARK) {
    return DisplayStyleType.DARK;
    // 디바이스 버튼
  } else {
    return darkModeQuery.matches
      ? DisplayStyleType.DARK
      : DisplayStyleType.LIGHT;
  }
};

const DisplayStyleCardContainer = () => {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const [toggleType, setToggleType] = useRecoilState(displayStyleState);

  const handleButtonClick = (key: DisplayStyleToggleType) => {
    if (toggleType === key) return;
    setToggleType(key);
    localStorage.setItem("display-style-toggle", key);
  };

  useEffect(() => {
    const applyDisplayStyle = () => {
      const newDarkMode = getInitialDisplayStyle(toggleType, darkModeQuery);
      document.body.setAttribute("display-style", newDarkMode);
    };

    applyDisplayStyle();

    const handleSystemThemeChange = () => {
      if (toggleType === DisplayStyleToggleType.DEVICE) {
        applyDisplayStyle();
      }
    };

    darkModeQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      darkModeQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [toggleType]);

  return <DisplayStyleCard handleButtonClick={handleButtonClick} />;
};

export default DisplayStyleCardContainer;
