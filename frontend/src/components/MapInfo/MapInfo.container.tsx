import useMenu from "@/hooks/useMenu";
import { currentLocationFloorState } from "@/recoil/selectors";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import MapInfo from "./MapInfo";

const MapInfoContainer = () => {
  const [touchOffset, setTouchOffset] = useState(0);
  const floorInfo = useRecoilValue(currentLocationFloorState);
  const [floor, setFloor] = useState(floorInfo[0]);
  const touchStart = (e: React.TouchEvent) => {
    setTouchOffset(e.changedTouches[0].clientX);
  };
  const { closeMap } = useMenu();

  const touchEnd = (e: React.TouchEvent) => {
    const result = e.changedTouches[0].clientX - touchOffset;
    let index = floorInfo.indexOf(floor);
    if (Math.abs(result) < 50) return;

    if (result > 0) {
      index++;
      if (index === floorInfo.length) index = 0;
    } else {
      index--;
      if (index === -1) index = floorInfo.length - 1;
    }
    setFloor(floorInfo[index]);
  };
  return (
    <MapInfo
      touchStart={touchStart}
      touchEnd={touchEnd}
      floor={floor}
      setFloor={setFloor}
      floorInfo={floorInfo}
      closeMap={closeMap}
    />
  );
};

export default MapInfoContainer;
