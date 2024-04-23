import { getInitialColorTheme } from "@/components/Card/DisplayStyleCard/DisplayStyleCard.container";
import {
  ColorThemeToggleType,
  ColorThemeType,
} from "@/types/enum/colorTheme.type.enum";

// TODO : 파일 위치?

(function () {
  function getInitialColorMode() {
    const isClient = typeof window !== "undefined";
    if (isClient) {
      const savedColorThemeToggle =
        (localStorage.getItem("color-theme-toggle") as ColorThemeToggleType) ||
        ColorThemeToggleType.DEVICE;
      const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

      return getInitialColorTheme(savedColorThemeToggle, darkModeQuery);
    }
  }
  const colorMode = getInitialColorMode();
  //   TODO : colorMode가 undefined 일땐?
  document.documentElement.style.setProperty(
    "background-color",
    colorMode === ColorThemeType.DARK ? "#1f1f1f" : "#ffffff"
  );
  //   NOTE : 새로고침 깜박임 현상 방지
  //   이 코드가 실행중일땐 전역변수가 아직 정의가 안된 상태라 전역변수 대신 hex code 사용
  document.addEventListener("DOMContentLoaded", function () {
    document.body.setAttribute("color-theme", colorMode!);
  });
})();
