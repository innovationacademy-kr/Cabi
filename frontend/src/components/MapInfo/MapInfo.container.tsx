import useMenu from "@/hooks/useMenu";
import { currentLocationFloorState } from "@/recoil/selectors";
import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import MapInfo from "./MapInfo";

const MapInfoContainer = () => {
  const touchXpos = useRef(0);
  const touchYpos = useRef(0);
  const floorInfo = useRecoilValue(currentLocationFloorState);
  const [floor, setFloor] = useState(floorInfo[0]);
  const touchStart = (e: React.TouchEvent) => {
    touchXpos.current = e.changedTouches[0].clientX;
    touchYpos.current = e.changedTouches[0].clientY;
  };
  const { closeMap } = useMenu();

  const touchEnd = (e: React.TouchEvent) => {
    const offsetX = e.changedTouches[0].clientX - touchXpos.current;
    const offsetY = e.changedTouches[0].clientY - touchYpos.current;
    let index = floorInfo.indexOf(floor);
    if (Math.abs(offsetX) < 100 || Math.abs(offsetY) > 100) return;

    if (offsetX < 0) {
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
