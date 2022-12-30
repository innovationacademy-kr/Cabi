import { useRecoilValue, useRecoilState } from "recoil";
import {
  currentFloorNumberState,
  currentSectionNameState,
} from "@/recoil/atoms";
import { currentFloorSectionState } from "@/recoil/selectors";
import SectionPaginationContainer from "@/containers/SectionPaginationContainer";

const SectionPagination = (): JSX.Element => {
  const floor = useRecoilValue<number>(currentFloorNumberState);
  const sectionList = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentSectionIdx = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );
  const currentPositionName = floor?.toString() + "층 - " + currentSectionName;

  const changeSectionOnClickIdxButton = (idx: number) => {
    if (sectionList === undefined) return;

    const targetSectionName = sectionList.at(idx);
    if (targetSectionName === undefined) return;
    setCurrentSectionName(targetSectionName);
  };

  const moveToLeftSection = () => {
    if (currentSectionIdx == 0) {
      setCurrentSectionName(sectionList[sectionList.length - 1]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx - 1]);
    }
  };

  const moveToRightSection = () => {
    if (currentSectionIdx == sectionList.length - 1) {
      setCurrentSectionName(sectionList[0]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx + 1]);
    }
  };

  const isLoaded = floor !== undefined && sectionList !== undefined;
  if (isLoaded === false) return <></>;

  return (
    <SectionPaginationContainer
      currentSectionName={currentSectionName}
      currentPositionName={currentPositionName}
      sectionList={sectionList}
      changeSectionOnClickIdxButton={changeSectionOnClickIdxButton}
      moveToLeftSection={moveToLeftSection}
      moveToRightSection={moveToRightSection}
    />
  );
};

export default SectionPagination;
