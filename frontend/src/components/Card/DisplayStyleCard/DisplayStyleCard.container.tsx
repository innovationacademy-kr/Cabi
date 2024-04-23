import { useEffect, useState } from "react";
import DisplayStyleCard from "@/components/Card/DisplayStyleCard/DisplayStyleCard";
import ColorType from "@/types/enum/color.type.enum";
import {
  ColorThemeToggleType,
  ColorThemeType,
} from "@/types/enum/colorTheme.type.enum";

// TODO: 포인트랑 테마 구분지을 수 있게 명명
const DisplayStyleCardContainer = () => {
  const savedMainColor =
    localStorage.getItem("main-color") || "var(--default-main-color)";
  const savedSubColor =
    localStorage.getItem("sub-color") || "var(--default-sub-color)";
  const savedMineColor =
    localStorage.getItem("mine-color") || "var(--default-mine-color)";

  const [mainColor, setMainColor] = useState<string>(savedMainColor);
  const [subColor, setSubColor] = useState<string>(savedSubColor);
  const [mineColor, setMineColor] = useState<string>(savedMineColor);

  const [showColorPicker, setShowColorPicker] = useState(false);
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
    root.style.setProperty("--main-color", main);
    root.style.setProperty("--sub-color", sub);
    root.style.setProperty("--mine-color", mine);
    localStorage.setItem("main-color", main);
    localStorage.setItem("sub-color", sub);
    localStorage.setItem("mine-color", mine);

    setToggleType(toggleType);
    localStorage.setItem("color-theme-toggle", toggleType);
  };

  const handleReset = () => {
    setColorsAndLocalStorage(
      "var(--default-main-color)",
      "var(--default-sub-color)",
      "var(--default-mine-color)",
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
    root.style.setProperty("--main-color", mainColor);
    root.style.setProperty("--sub-color", subColor);
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
  const [darkMode, setDarkMode] = useState<ColorThemeType>(
    ColorThemeType.LIGHT
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
