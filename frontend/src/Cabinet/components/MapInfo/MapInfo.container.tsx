import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentFloorNumberState,
  currentMapFloorState,
} from "@/Cabinet/recoil/atoms";
import { currentBuildingFloorState } from "@/Cabinet/recoil/selectors";
import MapInfo from "@/Cabinet/components/MapInfo/MapInfo";
import useMenu from "@/Cabinet/hooks/useMenu";

const MapInfoContainer = () => {
  const { closeMap } = useMenu();
  const floorInfo = useRecoilValue(currentBuildingFloorState);
  const [currentMapFloor, setCurrentMapFloor] =
    useRecoilState<number>(currentMapFloorState);
  const [currentFloor] = useRecoilState<number>(currentFloorNumberState);
  const touchXpos = useRef(0);
  const touchYpos = useRef(0);

  useEffect(() => {
    if (currentMapFloor === undefined) {
      if (currentFloor === undefined) setCurrentMapFloor(floorInfo[0]);
      else setCurrentMapFloor(currentFloor);
      return;
    }
  }, [currentMapFloor]);

  const touchStart = (e: React.TouchEvent) => {
    touchXpos.current = e.changedTouches[0].clientX;
    touchYpos.current = e.changedTouches[0].clientY;
  };

  const touchEnd = (e: React.TouchEvent) => {
    const offsetX = Math.round(e.changedTouches[0].clientX - touchXpos.current);
    const offsetY = Math.round(e.changedTouches[0].clientY - touchYpos.current);
    let index = floorInfo.indexOf(currentMapFloor);
    index = swipeMap(offsetX, offsetY, index);
    setCurrentMapFloor(floorInfo[index]);
  };

  const swipeMap = (offsetX: number, offsetY: number, index: number) => {
    if (Math.abs(offsetX) < 50 || Math.abs(offsetX) < Math.abs(offsetY)) {
      return index;
    }
    index = offsetX < 0 ? index + 1 : index - 1;
    index = (index + floorInfo.length) % floorInfo.length;
    return index;
  };

  return (
    <MapInfo
      touchStart={touchStart}
      touchEnd={touchEnd}
      floor={currentMapFloor}
      setFloor={setCurrentMapFloor}
      floorInfo={floorInfo}
      closeMap={closeMap}
    />
  );
};

export default MapInfoContainer;
