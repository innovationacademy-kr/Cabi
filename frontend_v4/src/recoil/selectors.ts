import { axiosCabinetById } from "@/api/axios/axios.custom";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { selector } from "recoil";
import {
  locationsFloorState,
  currentLocationNameState,
  currentFloorCabinetState,
  currentSectionNameState,
  currentCabinetIdState,
} from "./atoms";
import axios, { AxiosResponse } from "axios";

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

// export const targetCabinetInfoSelectorState = selector<CabinetInfo | undefined>(
//   {
//     key: "TargetCabinetSelectorInfo",
//     get: async ({ get }) => {
//       const currentCabinetId = get(currentCabinetIdState);

//       if (currentCabinetId === undefined) return;
//       try {
//         const cabinetInfoResponse: AxiosResponse<CabinetInfo> =
//           await axiosCabinetById(currentCabinetId);
//         return cabinetInfoResponse.data;
//       } catch (error) {
//         console.log(error);
//       }
//     },
//   }
// );
