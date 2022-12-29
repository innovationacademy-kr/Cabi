import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { selector } from "recoil";
import {
  locationsFloorState,
  currentLocationNameState,
  currentFloorCabinetState,
  currentSectionNameState,
} from "./atoms";

export const currentLocationFloorState = selector<Array<number>>({
  key: "CurrentLocationFloor",
  get: ({ get }) => {
    const currentLocationData = get(locationsFloorState);
    const currentLocation = get(currentLocationNameState);

    const currentLocationIndex = currentLocationData.findIndex((building) => {
      return building.location === currentLocation;
    });
    if (currentLocationIndex === -1) return [];
    return currentLocationData[currentLocationIndex].floors;
  },
});

export const currentFloorSectionState = selector<Array<string>>({
  key: "CurrentFloorSection",
  get: ({ get }) => {
    const currentFloorData = get(currentFloorCabinetState);

    return currentFloorData.map((floor) => floor.section);
  },
});

export const currentSectionCabinetState = selector<CabinetInfo[]>({
  key: "CurrentSectionCabinet",
  get: ({ get }) => {
    const currentFloorData = get(currentFloorCabinetState);
    const currentSection = get(currentSectionNameState);

    const currentSectionIndex = currentFloorData.findIndex((floor) => {
      return floor.section === currentSection;
    });
    if (currentSectionIndex === -1) return [];
    return currentFloorData[currentSectionIndex].cabinets;
  },
});
