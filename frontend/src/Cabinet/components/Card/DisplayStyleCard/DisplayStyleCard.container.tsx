import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { displayStyleState } from "@/Cabinet/recoil/atoms";
import DisplayStyleCard from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard";
import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";

// 로컬스토리지의 display-style-toggle 값에 따라 DisplayStyleType 반환
export const getInitialDisplayStyle = (
  savedDisplayStyleToggle: DisplayStyleToggleType,
  darkModeQuery: MediaQueryList
) => {
  // 라이트 / 다크 버튼
  if (savedDisplayStyleToggle === DisplayStyleToggleType.LIGHT)
    return DisplayStyleType.LIGHT;
  else if (savedDisplayStyleToggle === DisplayStyleToggleType.DARK)
    return DisplayStyleType.DARK;
  // 디바이스 버튼
  if (darkModeQuery.matches) {
    return DisplayStyleType.DARK;
  }
  return DisplayStyleType.LIGHT;
};

const DisplayStyleCardContainer = () => {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const [toggleType, setToggleType] = useRecoilState(displayStyleState);
  const initialDisplayStyle = getInitialDisplayStyle(
    toggleType as DisplayStyleToggleType,
    darkModeQuery
  );
  const [darkMode, setDarkMode] =
    useState<DisplayStyleType>(initialDisplayStyle);

  const setColorsAndLocalStorage = (toggleType: DisplayStyleToggleType) => {
    setToggleType(toggleType);
    localStorage.setItem("display-style-toggle", toggleType);
  };

  const handleDisplayStyleButtonClick = (displayStyleToggleType: string) => {
    const castedToggleType = displayStyleToggleType as DisplayStyleToggleType;
    if (toggleType === castedToggleType) return;
    setColorsAndLocalStorage(castedToggleType);
  };

  useEffect(() => {
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (toggleType === DisplayStyleToggleType.DEVICE) {
        setDarkMode(
          event.matches ? DisplayStyleType.DARK : DisplayStyleType.LIGHT
        );
      }
    };
    darkModeQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      darkModeQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [toggleType]);

  useEffect(() => {
    document.body.setAttribute("display-style", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (toggleType === DisplayStyleToggleType.LIGHT) {
      setDarkMode(DisplayStyleType.LIGHT);
    } else if (toggleType === DisplayStyleToggleType.DARK) {
      setDarkMode(DisplayStyleType.DARK);
    } else {
      setDarkMode(
        darkModeQuery.matches ? DisplayStyleType.DARK : DisplayStyleType.LIGHT
      );
    }
  }, [toggleType, darkModeQuery.matches]);

  return (
    <DisplayStyleCard
      handleDisplayStyleButtonClick={handleDisplayStyleButtonClick}
    />
  );
};

export default DisplayStyleCardContainer;
