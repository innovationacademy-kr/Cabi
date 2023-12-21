import { useEffect, useState } from "react";
import ThemeColorCard from "@/components/Card/ThemeColorCard/ThemeColorCard";
import ColorType from "@/types/enum/color.type.enum";

const ThemeColorCardContainer = () => {
  const savedMainColor =
    localStorage.getItem("main-color") || "var(--default-main-color)";
  const savedSubColor =
    localStorage.getItem("sub-color") || "var(--default-sub-color)";
  const savedMineColor =
    localStorage.getItem("mine-color") || "var(--default-mine-color)";

  const [mainColor, setMainColor] = useState<string>(
    savedMainColor ? savedMainColor : "var(--default-main-color)"
  );
  const [subColor, setSubColor] = useState<string>(
    savedSubColor ? savedSubColor : "var(--default-sub-color)"
  );
  const [mineColor, setMineColor] = useState<string>(
    savedMineColor ? savedMineColor : "var(--default-mine-color)"
  );

  const [showColorPicker, setShowColorPicker] = useState(false);
  const root: HTMLElement = document.documentElement;

  const handleChange = (mainColor: { hex: string }, type: string) => {
    const selectedColor: string = mainColor.hex;
    if (type === ColorType.MAIN) {
      setMainColor(selectedColor);
    } else if (type === ColorType.SUB) {
      setSubColor(selectedColor);
    } else if (type === ColorType.MINE) {
      setMineColor(selectedColor);
    }
  };

  const handleReset = () => {
    setMainColor("var(--default-main-color)");
    setSubColor("var(--default-sub-color)");
    setMineColor("var(--default-mine-color)");
    root.style.setProperty("--main-color", "var(--default-main-color)");
    root.style.setProperty("--sub-color", "var(--default-sub-color)");
    root.style.setProperty("--mine", "var(--default-mine-color)");
    localStorage.setItem("main-color", "var(--default-main-color)");
    localStorage.setItem("sub-color", "var(--default-sub-color)");
    localStorage.setItem("mine-color", "var(--default-mine-color)");
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
