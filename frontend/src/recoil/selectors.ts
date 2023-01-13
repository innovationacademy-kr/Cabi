import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { selector } from "recoil";
import {
  locationsFloorState,
  currentLocationNameState,
  currentFloorCabinetState,
  currentSectionNameState,
  currentFloorNumberState,
  locationColNumState,
} from "@/recoil/atoms";
import {
  IFloorSectionColNum,
  ISectionColNum,
} from "@/assets/data/sectionColNumData";

export const locationsState = selector<Array<string>>({
  key: "Locations",
  get: ({ get }) => {
    const locationsFloorData = get(locationsFloorState);

    const locationsArray = locationsFloorData.map((data) => data.location);
    return locationsArray;
  },
});

export const currentLocationFloorState = selector<Array<number>>({
  key: "CurrentLocationFloor",
  get: ({ get }) => {
    const locationsFloorData = get(locationsFloorState);
    const currentLocation = get(currentLocationNameState);

    const currentLocationIndex = locationsFloorData.findIndex((building) => {
      return building.location === currentLocation;
    });
    if (currentLocationIndex === -1) return [];
    return locationsFloorData[currentLocationIndex].floors;
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

/* colNum selector test */

export const currentLocationColNumState = selector<IFloorSectionColNum[]>({
  key: "CurrentLocationColNum",
  get: ({ get }) => {
    const locationColNum = get(locationColNumState);
    const currentLocationName = get(currentLocationNameState);
    const currentLocationIdx = locationColNum.findIndex(
      (building) => building.location === currentLocationName
    );

    if (currentLocationIdx === -1) return [];
    return locationColNum[currentLocationIdx].floorColNum;
  },
});

export const currentFloorColNumState = selector<ISectionColNum[]>({
  key: "CurrentFloorSectionColNum",
  get: ({ get }) => {
    const currentLocationColNum = get(currentLocationColNumState);
    const currentFloorNumber = get(currentFloorNumberState);
    const currentFloorIdx = currentLocationColNum.findIndex(
      (location) => location.floor === currentFloorNumber
    );

    if (currentFloorIdx === -1) return [];
    return currentLocationColNum[currentFloorIdx].sectionColNum;
  },
});

export const currentSectionColNumState = selector<number | undefined>({
  key: "CurrentSectionColNum",
  get: ({ get }) => {
    const currentFloorColNum = get(currentFloorColNumState);
    const currentSectionName = get(currentSectionNameState);
    const currentSectionIdx = currentFloorColNum.findIndex(
      (floor) => floor.section === currentSectionName
    );

    if (currentSectionIdx === -1) return undefined;
    return currentFloorColNum[currentSectionIdx].colNum;
  },
});

// 한 번에 처리

// export const currentSectionColNumState = selector<number | undefined>({
//   key: "CurrentSectionColNum",
//   get: ({ get }) => {
//     const locationColNum = get(locationColNumState);
//     const currentLocationName = get(currentLocationNameState);
//     const currentFloorNumber = get(currentFloorNumberState);
//     const currentSectionName = get(currentSectionNameState);

//     return locationColNum
//       .find((building) => building.location === currentLocationName)
//       ?.floorColNum.find(
//         (location) => location.floor === currentFloorNumber
//       )
//       ?.sectionColNum.find((floor) => floor.section === currentSectionName)
//       ?.colNum;
//   },
// });

/* ---------------------- */

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
