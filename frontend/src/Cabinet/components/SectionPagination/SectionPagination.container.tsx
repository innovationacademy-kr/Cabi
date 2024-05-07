import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentFloorNumberState,
  currentSectionNameState,
} from "@/Cabinet/recoil/atoms";
import { currentFloorSectionState } from "@/Cabinet/recoil/selectors";
import SectionPagination from "@/Cabinet/components/SectionPagination/SectionPagination";

const SectionPaginationContainer = (): JSX.Element => {
  const floor = useRecoilValue<number>(currentFloorNumberState);
  const sectionList = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentSectionIndex = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );
  const currentPositionName = floor?.toString() + "층 - " + currentSectionName;

  const changeSectionOnClickIndexButton = (index: number) => {
    if (sectionList === undefined) return;

    const targetSectionName = sectionList.at(index);
    if (targetSectionName === undefined) return;
    setCurrentSectionName(targetSectionName);
  };

  const moveToLeftSection = () => {
    if (currentSectionIndex <= 0) {
      setCurrentSectionName(sectionList[sectionList.length - 1]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIndex - 1]);
    }
  };

  const moveToRightSection = () => {
    if (currentSectionIndex >= sectionList.length - 1) {
      setCurrentSectionName(sectionList[0]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIndex + 1]);
    }
  };

  const isLoaded =
    floor !== undefined &&
    sectionList !== undefined &&
    currentSectionName !== undefined;

  return (
    <React.Fragment>
      {isLoaded && (
        <SectionPagination
          currentSectionName={currentSectionName}
          currentPositionName={currentPositionName}
          sectionList={sectionList}
          changeSectionOnClickIndexButton={changeSectionOnClickIndexButton}
          moveToLeftSection={moveToLeftSection}
          moveToRightSection={moveToRightSection}
        />
      )}
    </React.Fragment>
  );
};

export default SectionPaginationContainer;
