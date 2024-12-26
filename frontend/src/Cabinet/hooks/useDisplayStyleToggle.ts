import { useRecoilState } from "recoil";
import { displayStyleState } from "@/Cabinet/recoil/atoms";
import { updateLocalStorageDisplayStyleToggle } from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard";
import { DisplayStyleToggleType } from "@/Cabinet/types/enum/displayStyle.type.enum";

export const useDisplayStyleToggle = () => {
  const [toggleType, setToggleType] = useRecoilState(displayStyleState);

  const updateToggleType = (newToggleType: DisplayStyleToggleType) => {
    setToggleType(newToggleType);
    updateLocalStorageDisplayStyleToggle(newToggleType);
  };

  const addDarkModeListener = (
    darkModeQuery: MediaQueryList,
    callback: () => void
  ) => {
    if (toggleType === DisplayStyleToggleType.DEVICE) {
      darkModeQuery.addEventListener("change", callback);
      return () => {
        darkModeQuery.removeEventListener("change", callback);
      };
    }
  };
  return { updateToggleType, addDarkModeListener };
};

export default useDisplayStyleToggle;
