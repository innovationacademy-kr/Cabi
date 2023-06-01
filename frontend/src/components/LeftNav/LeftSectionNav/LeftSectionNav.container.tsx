import { useRecoilState, useRecoilValue } from "recoil";
import { currentSectionNameState } from "@/recoil/atoms";
import { currentFloorSectionState } from "@/recoil/selectors";
import LeftSectionNav from "@/components/LeftNav/LeftSectionNav/LeftSectionNav";
import useMenu from "@/hooks/useMenu";

const LeftSectionNavContainer = ({ isVisible }: { isVisible: boolean }) => {
  const floorSection = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentFloorSection, setCurrentFloorSection] = useRecoilState<string>(
    currentSectionNameState
  );

  const { closeLeftNav } = useMenu();

  const onClickSection = (section: string) => {
    closeLeftNav();
    setCurrentFloorSection(section);
  };

  return (
    <LeftSectionNav
      isVisible={isVisible}
      onClickSection={onClickSection}
      currentFloorSection={currentFloorSection}
      floorSection={floorSection}
    />
  );
};

export default LeftSectionNavContainer;
