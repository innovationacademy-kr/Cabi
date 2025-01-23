import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentFloorNumberState,
  currentSectionNameState,
} from "@/Cabinet/recoil/atoms";
import { currentFloorSectionState } from "@/Cabinet/recoil/selectors";
import SectionPagination from "@/Cabinet/components/SectionPagination/SectionPagination";
import { ICurrentSectionInfo } from "@/Cabinet/types/dto/cabinet.dto";

const SectionPaginationContainer = (): JSX.Element => {
  const currentFloor = useRecoilValue<number>(currentFloorNumberState);
  const sectionList: Array<ICurrentSectionInfo> = useRecoilValue<
    Array<ICurrentSectionInfo>
  >(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentSectionIndex = sectionList.findIndex(
    (section) => section.sectionName === currentSectionName
  );
  const currentPositionName =
    currentFloor?.toString() + "층 - " + currentSectionName;

  const changeSectionOnClickIndexButton = (index: number) => {
    if (sectionList === undefined) return;

    const targetSectionName = sectionList.at(index)?.sectionName;
    if (targetSectionName === undefined) return;
    setCurrentSectionName(targetSectionName);
  };

  const moveToLeftSection = () => {
    if (currentSectionIndex <= 0) {
      setCurrentSectionName(sectionList[sectionList.length - 1].sectionName);
    } else {
      setCurrentSectionName(sectionList[currentSectionIndex - 1].sectionName);
    }
  };

  const moveToRightSection = () => {
    if (currentSectionIndex >= sectionList.length - 1) {
      setCurrentSectionName(sectionList[0].sectionName);
    } else {
      setCurrentSectionName(sectionList[currentSectionIndex + 1].sectionName);
    }
  };

  const isLoaded =
    !currentFloor &&
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
