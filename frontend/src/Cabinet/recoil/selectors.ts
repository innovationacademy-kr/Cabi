import { selector } from "recoil";
import {
  buildingColNumState,
  buildingsFloorState,
  currentBuildingNameState,
  currentFloorCabinetState,
  currentFloorNumberState,
  currentSectionNameState,
  userState,
} from "@/Cabinet/recoil/atoms";
import { TOAuthProviderOrEmpty } from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCard.container";
import {
  IFloorSectionColNum,
  ISectionColNum,
} from "@/Cabinet/assets/data/sectionColNumData";
import {
  CabinetPreviewInfo,
  ICurrentSectionInfo,
} from "@/Cabinet/types/dto/cabinet.dto";
import { IUserOAuthLinkInfoDto } from "@/Cabinet/types/dto/oAuth.dto";

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

export const currentFloorSectionState = selector<Array<ICurrentSectionInfo>>({
  key: "CurrentFloorSection",
  get: ({ get }) => {
    const currentFloorData = get(currentFloorCabinetState);

    return currentFloorData.map((floor) => {
      return {
        sectionName: floor.section,
        alarmRegistered: floor.alarmRegistered,
      };
    });
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
    const currentFloor = get(currentFloorNumberState);
    const currentFloorIdx = currentLocationColNum.findIndex(
      (building) => building.floor === currentFloor
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

export const linkedOAuthInfoState = selector<IUserOAuthLinkInfoDto | null>({
  key: "LinkedOAuthInfo",
  get: ({ get }) => {
    const myInfo = get(userState);

    return myInfo.userOauthConnection;
  },
});
// TODO : 다른 데에서도 사용하는지 확인하고 적용

export const linkedProviderState = selector<TOAuthProviderOrEmpty>({
  key: "LinkedProvider",
  get: ({ get }) => {
    const linkedOAuthInfo = get(linkedOAuthInfoState);
    const linkedProvider: TOAuthProviderOrEmpty = linkedOAuthInfo
      ? linkedOAuthInfo.providerType
      : "";

    return linkedProvider;
  },
});
// TODO : 다른 데에서도 사용하는지 확인하고 적용
