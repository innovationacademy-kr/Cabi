import { useEffect, useState } from "react";
import PointColorCard from "@/Cabinet/components/Card/PointColorCard/PointColorCard";
import ColorType from "@/Cabinet/types/enum/color.type.enum";

const PointColorCardContainer = () => {
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
    mine: string
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
  };

  const handleReset = () => {
    setColorsAndLocalStorage(
      "var(--sys-default-main-color)",
      "var(--sys-default-sub-color)",
      "var(--sys-default-mine-color)"
    );
  };

  const handleSave = () => {
    setColorsAndLocalStorage(mainColor, subColor, mineColor);
    setShowColorPicker(!showColorPicker);
  };

  const handleCancel = () => {
    setColorsAndLocalStorage(savedMainColor, savedSubColor, savedMineColor);
    setShowColorPicker(!showColorPicker);
  };

  const handlePointColorButtonClick = (pointColorType: string) => {
    setSelectedColorType(pointColorType);
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

  return (
    <PointColorCard
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
    />
  );
};

export default PointColorCardContainer;
