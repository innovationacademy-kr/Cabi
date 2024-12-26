import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";

export const getDisplayStyleFromLocalStorage: () => DisplayStyleToggleType =
  () => {
    return (
      (localStorage.getItem(
        "display-style-toggle"
      ) as DisplayStyleToggleType) || DisplayStyleToggleType.DEVICE
    );
  };

export const updateBodyDisplayStyle = (style: DisplayStyleType) => {
  document.body.setAttribute("display-style", style);
};

export const isDeviceDarkMode = () => {
  return window.matchMedia("(prefers-color-scheme: dark)");
};
