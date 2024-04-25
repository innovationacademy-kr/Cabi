import { getInitialColorTheme } from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard.container";
import {
  ColorThemeToggleType,
  ColorThemeType,
} from "@/Cabinet/types/enum/colorTheme.type.enum";

(function () {
  const isClient = typeof window !== "undefined";
  if (isClient) {
    const savedColorThemeToggle =
      (localStorage.getItem("color-theme-toggle") as ColorThemeToggleType) ||
      ColorThemeToggleType.DEVICE;
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const colorMode = getInitialColorTheme(
      savedColorThemeToggle,
      darkModeQuery
    );

    document.documentElement.style.setProperty(
      "background-color",
      colorMode === ColorThemeType.DARK ? "#1f1f1f" : "#ffffff"
    );
    //   NOTE : 새로고침 깜박임 현상 방지
    //   이 코드가 실행중일땐 전역변수가 아직 정의가 안된 상태라 전역변수 대신 hex code 사용

    document.addEventListener("DOMContentLoaded", function () {
      document.body.setAttribute("color-theme", colorMode);
    });
  }
})();
