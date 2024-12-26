import { getInitialDisplayStyle } from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard.container";
import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";
import {
  getDisplayStyleFromLocalStorage,
  isDeviceDarkMode,
  updateBodyDisplayStyle,
} from "@/Cabinet/utils/displayStyleUtils";

(function () {
  const isClient = typeof window !== "undefined";
  if (isClient) {
    const darkModeQuery = isDeviceDarkMode();

    const colorMode = getInitialDisplayStyle(
      getDisplayStyleFromLocalStorage(),
      darkModeQuery
    );

    document.documentElement.style.setProperty(
      "background-color",
      colorMode === DisplayStyleType.DARK ? "#1f1f1f" : "#ffffff"
    );
    //   NOTE : 새로고침 깜박임 현상 방지
    //   이 코드가 실행중일땐 전역변수가 아직 정의가 안된 상태라 전역변수 대신 hex code 사용

    document.addEventListener("DOMContentLoaded", function () {
      updateBodyDisplayStyle(colorMode);
    });
  }
})();
