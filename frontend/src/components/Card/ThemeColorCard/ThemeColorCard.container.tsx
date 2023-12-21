import { useEffect, useState } from "react";
import ThemeColorCard from "@/components/Card/ThemeColorCard/ThemeColorCard";
import ColorType from "@/types/enum/color.type.enum";

const ThemeColorCardContainer = () => {
  const savedMainColor = localStorage.getItem("main-color") || ColorType.MAIN;
  const savedSubColor = localStorage.getItem("sub-color") || ColorType.SUB;
  const savedMineColor = localStorage.getItem("mine-color") || ColorType.MINE;

  const [mainColor, setMainColor] = useState<string>(
    savedMainColor ? savedMainColor : ColorType.MAIN
  );
  const [subColor, setSubColor] = useState<string>(
    savedSubColor ? savedSubColor : ColorType.SUB
  );
  const [mineColor, setMineColor] = useState<string>(
    savedMineColor ? savedMineColor : ColorType.MINE
  );

  const [showColorPicker, setShowColorPicker] = useState(false);
  const root: HTMLElement = document.documentElement;

  const handleChange = (mainColor: { hex: string }, type: string) => {
    const selectedColor: string = mainColor.hex;
    if (type === "main") {
      setMainColor(selectedColor);
    } else if (type === "sub") {
      setSubColor(selectedColor);
    } else if (type === "mine") {
      setMineColor(selectedColor);
    }
  };

  const handleReset = () => {
    setMainColor(ColorType.MAIN);
    setSubColor(ColorType.SUB);
    setMineColor(ColorType.MINE);
    root.style.setProperty("--main-color", ColorType.MAIN);
    root.style.setProperty("--sub-color", ColorType.SUB);
    root.style.setProperty("--mine", ColorType.MINE);
    localStorage.setItem("main-color", ColorType.MAIN);
    localStorage.setItem("sub-color", ColorType.SUB);
    localStorage.setItem("mine-color", ColorType.MINE);
  };

  const handleSave = () => {
    localStorage.setItem("main-color", mainColor);
    root.style.setProperty("--main-color", mainColor);
    localStorage.setItem("sub-color", subColor);
    root.style.setProperty("--sub-color", subColor);
    localStorage.setItem("mine-color", mineColor);
    root.style.setProperty("--mine", mineColor);
    toggleColorPicker(true);
  };

  const handleCancel = () => {
    root.style.setProperty("--main-color", savedMainColor);
    root.style.setProperty("--mine", savedMineColor);
    setMainColor(savedMainColor);
    setSubColor(savedSubColor);
    setMineColor(savedMineColor);
    toggleColorPicker(true);
  };

  const toggleColorPicker = (isChange: boolean) => {
    if (isChange) setShowColorPicker(!showColorPicker);
  };

  const confirmBeforeUnload = (e: BeforeUnloadEvent) => {
    {
      e.returnValue =
        "변경된 색상이 저장되지 않을 수 있습니다. 계속하시겠습니까?";
    }
  };

  const [selectedColorType, setSelectedColorType] = useState<string>("");

  const handleColorButtonClick = (colorType: string) => {
    if (showColorPicker) return;
    setSelectedColorType(colorType);
    setShowColorPicker(!showColorPicker);
  };

  useEffect(() => {
    root.style.setProperty("--main-color", mainColor);
    root.style.setProperty("--mine", mineColor);
    window.addEventListener("beforeunload", confirmBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", confirmBeforeUnload);
    };
  }, [mainColor, mineColor]);

  return (
    <ThemeColorCard
      showColorPicker={showColorPicker}
      handleChange={handleChange}
      handleReset={handleReset}
      handleSave={handleSave}
      handleCancel={handleCancel}
      mainColor={mainColor}
      subColor={subColor}
      mineColor={mineColor}
      handleColorButtonClick={handleColorButtonClick}
      selectedColorType={selectedColorType}
    />
  );
};

export default ThemeColorCardContainer;
