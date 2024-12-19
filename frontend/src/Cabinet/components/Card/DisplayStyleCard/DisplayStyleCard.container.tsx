import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { displayStyleState } from "@/Cabinet/recoil/atoms";
import DisplayStyleCard from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard";
import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";
import useDisplayStyleToggle from "@/Cabinet/hooks/useDisplayStyleToggle";
import {
  isDeviceDarkMode,
  updateBodyDisplayStyle,
} from "@/Cabinet/utils/displayStyleUtils";

// 로컬스토리지의 display-style-toggle 값에 따라 DisplayStyleType 반환
export const getInitialDisplayStyle = (
  displayStyleToggle: DisplayStyleToggleType,
  darkModeQuery: MediaQueryList
): DisplayStyleType => {
  // 라이트 / 다크 버튼
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
  const darkModeQuery = isDeviceDarkMode();
  const toggleType = useRecoilValue(displayStyleState);
  const { addDarkModeListener } = useDisplayStyleToggle();

  useEffect(() => {
    const applyDisplayStyle = () => {
      const newDarkMode = getInitialDisplayStyle(toggleType, darkModeQuery);
      updateBodyDisplayStyle(newDarkMode);
    };

    applyDisplayStyle();
    const removeListener = addDarkModeListener(
      darkModeQuery,
      applyDisplayStyle
    );
    return removeListener;
  }, [toggleType]);

  return <DisplayStyleCard />;
};

export default DisplayStyleCardContainer;
