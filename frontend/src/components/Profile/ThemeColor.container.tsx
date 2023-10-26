import { useEffect, useState } from "react";
import ThemeColor from "./ThemeColor";

const ThemeColorContainer: React.FC<{
  showColorPicker: boolean;
  setShowColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showColorPicker, setShowColorPicker }) => {
  const savedColor = localStorage.getItem("mainColor");
  const defaultColor = "#9747ff";
  const [mainColor, setMainColor] = useState<string>(
    savedColor ? savedColor : defaultColor
  );
  const root: HTMLElement = document.documentElement;

  const handleChange = (mainColor: { hex: string }) => {
    const selectedColor: string = mainColor.hex;
    setMainColor(selectedColor);
  };

  const handleReset = () => {
    setMainColor(defaultColor);
    root.style.setProperty("--main-color", defaultColor);
    root.style.setProperty("--lightpurple-color", "#b18cff");
    localStorage.setItem("mainColor", defaultColor);
  };

  const handleSave = () => {
    localStorage.setItem("mainColor", mainColor);
    root.style.setProperty("--main-color", mainColor);
    toggleColorPicker(true);
  };

  const handleCancel = () => {
    const savedColor = localStorage.getItem("mainColor");
    root.style.setProperty("--main-color", savedColor);
    toggleColorPicker(true);
  };

  const toggleColorPicker = (isChange: boolean) => {
    if (isChange) setShowColorPicker(!showColorPicker);
  };

  const confirmBeforeUnload = (e: BeforeUnloadEvent) => {
    if (mainColor !== localStorage.getItem("mainColor")) {
      e.returnValue =
        "변경된 색상이 저장되지 않을 수 있습니다. 계속하시겠습니까?";
    }
  };

  useEffect(() => {
    root.style.setProperty("--main-color", mainColor);
    window.addEventListener("beforeunload", confirmBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", confirmBeforeUnload);
    };
  }, [mainColor]);

  return (
    <ThemeColor
      showColorPicker={showColorPicker}
      setShowColorPicker={setShowColorPicker}
      handleChange={handleChange}
      handleReset={handleReset}
      handleSave={handleSave}
      handleCancel={handleCancel}
      mainColor={mainColor}
    />
  );
};

export default ThemeColorContainer;
