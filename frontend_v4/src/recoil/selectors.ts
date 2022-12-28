import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { selector } from "recoil";
import {
  currentLocationDataState,
  currentLocationState,
  currentFloorDataState,
  currentSectionState,
} from "./atoms";

export const currentLocationFloorInfo = selector<Array<number>>({
  key: "CurrentLocationFloor",
  get: ({ get }) => {
    const currentLocationData = get(currentLocationDataState);
    const currentLocation = get(currentLocationState);

    const currentLocationIndex = currentLocationData.findIndex((building) => {
      return building.location === currentLocation;
    });
    if (currentLocationIndex === -1) return [];
    return currentLocationData[currentLocationIndex].floors;
  },
});

export const currentFloorSectionInfo = selector<Array<string>>({
  key: "CurrentFloorSection",
  get: ({ get }) => {
    const currentFloorData = get(currentFloorDataState);

    return currentFloorData.map((floor) => floor.section);
  },
});

export const currentSectionCabinetInfo = selector<CabinetInfo[]>({
  key: "CurrentSectionCabinet",
  get: ({ get }) => {
    const currentFloorData = get(currentFloorDataState);
    const currentSection = get(currentSectionState);

    const currentSectionIndex = currentFloorData.findIndex((floor) => {
      return floor.section === currentSection;
    });
    if (currentSectionIndex === -1) return [];
    return currentFloorData[currentSectionIndex].cabinets;
  },
});
