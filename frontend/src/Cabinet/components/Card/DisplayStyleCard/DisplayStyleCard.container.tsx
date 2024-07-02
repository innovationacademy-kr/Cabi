import { useEffect, useState } from "react";
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
  const savedDisplayStyleToggle =
    (localStorage.getItem("display-style-toggle") as DisplayStyleToggleType) ||
    DisplayStyleToggleType.DEVICE;
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const initialDisplayStyle = getInitialDisplayStyle(
    savedDisplayStyleToggle,
    darkModeQuery
  );
  const [darkMode, setDarkMode] = useState<DisplayStyleType>(
    initialDisplayStyle as DisplayStyleType
  );
  const [toggleType, setToggleType] = useState<DisplayStyleToggleType>(
    savedDisplayStyleToggle
  );

  const handleDisplayStyleButtonClick = (displayStyleToggleType: string) => {
    if (toggleType === displayStyleToggleType) return;
    setToggleType(
      displayStyleToggleType as React.SetStateAction<DisplayStyleToggleType>
    );
    localStorage.setItem("display-style-toggle", displayStyleToggleType);
  };

  useEffect(() => {
    darkModeQuery.addEventListener("change", (event) =>
      setDarkMode(
        event.matches ? DisplayStyleType.DARK : DisplayStyleType.LIGHT
      )
    );
  }, []);

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
  }, [toggleType]);

  return (
    <DisplayStyleCard
      displayStyleToggle={toggleType}
      handleDisplayStyleButtonClick={handleDisplayStyleButtonClick}
    />
  );
};

export default DisplayStyleCardContainer;
