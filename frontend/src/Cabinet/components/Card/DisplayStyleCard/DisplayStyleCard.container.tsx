import { useEffect, useState } from "react";
import DisplayStyleCard from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard";
import ColorType from "@/Cabinet/types/enum/color.type.enum";
import {
  ColorThemeToggleType,
  ColorThemeType,
} from "@/Cabinet/types/enum/colorTheme.type.enum";

// TODO : 토글말고 버튼으루
// 로컬스토리지의 color-theme-toggle 값에 따라 ColorThemeType 반환
export const getInitialColorTheme = (
  savedColorThemeToggle: ColorThemeToggleType,
  darkModeQuery: MediaQueryList
) => {
  // 라이트 / 다크 버튼
  if (savedColorThemeToggle === ColorThemeToggleType.LIGHT)
    return ColorThemeType.LIGHT;
  else if (savedColorThemeToggle === ColorThemeToggleType.DARK)
    return ColorThemeType.DARK;
  // 디바이스 버튼
  if (darkModeQuery.matches) {
    return ColorThemeType.DARK;
  }
  return ColorThemeType.LIGHT;
};

// TODO: 포인트랑 테마 구분지을 수 있게 명명
const DisplayStyleCardContainer = () => {
  const savedMainColor =
    localStorage.getItem("main-color") || "var(--sys-default-main-color)";
  const savedSubColor =
    localStorage.getItem("sub-color") || "var(--sys-default-sub-color)";
  const savedMineColor =
    localStorage.getItem("mine-color") || "var(--sys-default-mine-color)";

  const [mainColor, setMainColor] = useState<string>(savedMainColor);
  const [subColor, setSubColor] = useState<string>(savedSubColor);
  const [mineColor, setMineColor] = useState<string>(savedMineColor);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const body: HTMLElement = document.body;
  const root: HTMLElement = document.documentElement;

  const [selectedColorType, setSelectedColorType] = useState<string>(
    ColorType.MAIN
  );

  const handlePointColorChange = (
    mainColor: { hex: string },
    colorType: string
  ) => {
    const selectedColor: string = mainColor.hex;
    if (colorType === ColorType.MAIN) {
      setMainColor(selectedColor);
    } else if (colorType === ColorType.SUB) {
      setSubColor(selectedColor);
    } else if (colorType === ColorType.MINE) {
      setMineColor(selectedColor);
    }
  };

  const setColorsAndLocalStorage = (
    main: string,
    sub: string,
    mine: string,
    toggleType: ColorThemeToggleType
  ) => {
    setMainColor(main);
    setSubColor(sub);
    setMineColor(mine);
    body.style.setProperty("--sys-main-color", main);
    body.style.setProperty("--sys-sub-color", sub);
    body.style.setProperty("--mine-color", mine);
    root.style.setProperty("--sys-main-color", main);
    root.style.setProperty("--sys-sub-color", sub);
    root.style.setProperty("--mine-color", mine);
    localStorage.setItem("main-color", main);
    localStorage.setItem("sub-color", sub);
    localStorage.setItem("mine-color", mine);

    setToggleType(toggleType);
    localStorage.setItem("color-theme-toggle", toggleType);
  };

  const handleReset = () => {
    setColorsAndLocalStorage(
      "var(--sys-default-main-color)",
      "var(--sys-default-sub-color)",
      "var(--sys-default-mine-color)",
      ColorThemeToggleType.DEVICE
    );
  };

  const handleSave = () => {
    setColorsAndLocalStorage(mainColor, subColor, mineColor, toggleType);
    setShowColorPicker(!showColorPicker);
  };

  const handleCancel = () => {
    setColorsAndLocalStorage(
      savedMainColor,
      savedSubColor,
      savedMineColor,
      savedColorThemeToggle
    );
    setShowColorPicker(!showColorPicker);
  };

  const handlePointColorButtonClick = (pointColorType: string) => {
    setSelectedColorType(pointColorType);
    setShowColorPicker(true);
  };

  const handleColorThemeButtonClick = (colorThemeToggleType: string) => {
    if (toggleType === colorThemeToggleType) return;
    setToggleType(
      colorThemeToggleType as React.SetStateAction<ColorThemeToggleType>
    );
    setShowColorPicker(true);
  };

  useEffect(() => {
    body.style.setProperty("--sys-main-color", mainColor);
    body.style.setProperty("--sys-sub-color", subColor);
    body.style.setProperty("--mine-color", mineColor);
    root.style.setProperty("--sys-main-color", mainColor);
    root.style.setProperty("--sys-sub-color", subColor);
    root.style.setProperty("--mine-color", mineColor);
    const confirmBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        mainColor !== savedMainColor ||
        subColor !== savedSubColor ||
        mineColor !== savedMineColor
      ) {
        e.returnValue =
          "변경된 색상이 저장되지 않을 수 있습니다. 페이지를 나가시겠습니까?";
      }
    };
    window.addEventListener("beforeunload", confirmBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", confirmBeforeUnload);
    };
  }, [
    mainColor,
    mineColor,
    savedMainColor,
    savedMineColor,
    subColor,
    savedSubColor,
  ]);

  const savedColorThemeToggle =
    (localStorage.getItem("color-theme-toggle") as ColorThemeToggleType) ||
    ColorThemeToggleType.DEVICE;
  var darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const initialColorTheme = getInitialColorTheme(
    savedColorThemeToggle,
    darkModeQuery
  );
  const [darkMode, setDarkMode] = useState<ColorThemeType>(
    initialColorTheme as ColorThemeType
  );
  const [toggleType, setToggleType] = useState<ColorThemeToggleType>(
    savedColorThemeToggle
  );

  useEffect(() => {
    darkModeQuery.addEventListener("change", (event) =>
      setDarkMode(event.matches ? ColorThemeType.DARK : ColorThemeType.LIGHT)
    );
  }, []);

  useEffect(() => {
    document.body.setAttribute("color-theme", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (toggleType === ColorThemeToggleType.LIGHT) {
      setDarkMode(ColorThemeType.LIGHT);
    } else if (toggleType === ColorThemeToggleType.DARK) {
      setDarkMode(ColorThemeType.DARK);
    } else {
      setDarkMode(
        darkModeQuery.matches ? ColorThemeType.DARK : ColorThemeType.LIGHT
      );
    }
  }, [toggleType]);

  return (
    <DisplayStyleCard
      showColorPicker={showColorPicker}
      handlePointColorChange={handlePointColorChange}
      handleReset={handleReset}
      handleSave={handleSave}
      handleCancel={handleCancel}
      mainColor={mainColor}
      subColor={subColor}
      mineColor={mineColor}
      handlePointColorButtonClick={handlePointColorButtonClick}
      selectedColorType={selectedColorType}
      colorThemeToggle={toggleType}
      handleColorThemeButtonClick={handleColorThemeButtonClick}
    />
  );
};

export default DisplayStyleCardContainer;
