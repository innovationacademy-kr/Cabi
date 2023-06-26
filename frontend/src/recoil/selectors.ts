import { selector } from "recoil";
import {
  buildingColNumState,
  buildingsFloorState,
  currentBuildingNameState,
  currentFloorCabinetState,
  currentFloorNumberState,
  currentSectionNameState,
} from "@/recoil/atoms";
import {
  IFloorSectionColNum,
  ISectionColNum,
} from "@/assets/data/sectionColNumData";
import { CabinetInfo, CabinetPreviewInfo } from "@/types/dto/cabinet.dto";

export const buildingsState = selector<Array<string>>({
  key: "Buildings",
  get: ({ get }) => {
    const buildingsFloorData = get(buildingsFloorState);

    const buildingsArray = buildingsFloorData.map((data) => data.building);
    return buildingsArray;
  },
});

export const currentBuildingFloorState = selector<Array<number>>({
  key: "CurrentBuildingFloor",
  get: ({ get }) => {
    const buildingsFloorData = get(buildingsFloorState);
    const currentBuilding = get(currentBuildingNameState);

    const currentBuildingIndex = buildingsFloorData.findIndex((buildings) => {
      return buildings.building === currentBuilding;
    });
    if (currentBuildingIndex === -1) return [];
    return buildingsFloorData[currentBuildingIndex].floors;
  },
});

export const currentFloorSectionState = selector<Array<string>>({
  key: "CurrentFloorSection",
  get: ({ get }) => {
    const currentFloorData = get(currentFloorCabinetState);

    return currentFloorData.map((floor) => floor.section);
  },
});

export const currentSectionCabinetState = selector<CabinetPreviewInfo[]>({
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

export const currentBuildingColNumState = selector<IFloorSectionColNum[]>({
  key: "CurrentBuildingColNum",
  get: ({ get }) => {
    const buildingColNum = get(buildingColNumState);
    const currentBuildingName = get(currentBuildingNameState);
    const currentBuildingIdx = buildingColNum.findIndex(
      (buildings) => buildings.building === currentBuildingName
    );

    if (currentBuildingIdx === -1) return [];
    return buildingColNum[currentBuildingIdx].floorColNum;
  },
});

export const currentFloorColNumState = selector<ISectionColNum[]>({
  key: "CurrentFloorSectionColNum",
  get: ({ get }) => {
    const currentLocationColNum = get(currentBuildingColNumState);
    const currentFloorNumber = get(currentFloorNumberState);
    const currentFloorIdx = currentLocationColNum.findIndex(
      (building) => building.floor === currentFloorNumber
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
//     const buildingColNum = get(buildingColNumState);
//     const currentLocationName = get(currentLocationNameState);
//     const currentFloorNumber = get(currentFloorNumberState);
//     const currentSectionName = get(currentSectionNameState);

//     return buildingColNum
//       .find((building) => building.location === currentLocationName)
//       ?.floorColNum.find(
//         (building) => building.floor === currentFloorNumber
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
