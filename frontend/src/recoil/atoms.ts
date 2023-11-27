import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { staticColNumData } from "@/assets/data/sectionColNumData";
import { IBuildingColNum } from "@/assets/data/sectionColNumData";
import { ITableData } from "@/types/dto/admin.dto";
import {
  CabinetBuildingFloorDto,
  CabinetInfo,
  CabinetInfoByBuildingFloorDto,
  CabinetPreviewInfo,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import { ClubUserDto } from "@/types/dto/lent.dto";
import { UserDto, UserInfo } from "@/types/dto/user.dto";

const { persistAtom } = recoilPersist();

export const userState = atom<UserDto>({
  key: "UserInfo",
  default: {
    cabinetId: null,
    userId: null,
    name: "default",
    extensible: false,
  },
});

export const myCabinetInfoState = atom<MyCabinetInfoResponseDto>({
  key: "MyLentInfo",
  default: undefined,
});
// export const myCabinetInfoState = atom<MyCabinetInfoResponseDto>({
//   key: "MyLentInfo",
//   default: {
//     status: CabinetStatus.AVAILABLE,
//     lent_info: [],
//     building: "",
//     floor: -1,
//     section: "",
//     cabinet_memo: "",
//     cabinetId: -1,
//     visibleNum: -1,
//     lentType: "",
//     cabinet_title: "",
//     max_user: -1,
//   },
// });

export const buildingsFloorState = atom<CabinetBuildingFloorDto[]>({
  key: "CurrentBuildingData",
  default: [],
});

export const currentBuildingNameState = atom<string>({
  key: "CurrentBuilding",
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const currentFloorNumberState = atom<number>({
  key: "CurrentFloor",
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const currentMapFloorState = atom<number>({
  key: "CurrentMapFloor",
  default: undefined,
});

export const currentSectionNameState = atom<string>({
  key: "CurrentSection",
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const currentCabinetIdState = atom<number | null>({
  key: "CurrentCabinetId",
  default: undefined,
});

export const currentFloorCabinetState = atom<CabinetInfoByBuildingFloorDto[]>({
  key: "CurrentFloorData",
  default: [],
});

export const targetCabinetInfoState = atom<CabinetInfo>({
  key: "TargetCabinetInfo",
  default: undefined,
});

export const buildingColNumState = atom<IBuildingColNum[]>({
  key: "BuildingColNum",
  default: staticColNumData,
});

export const isCurrentSectionRenderState = atom<boolean>({
  key: "isCurrentSectionRender",
  default: false,
});

export const isMultiSelectState = atom<boolean>({
  key: "IsMultiSelect",
  default: false,
});

export const targetCabinetInfoListState = atom<CabinetPreviewInfo[]>({
  key: "TargetCabinetInfoList",
  default: [],
});

export const currentIntraIdState = atom<string>({
  key: "CurrentIntraId",
  default: undefined,
});

export const numberOfAdminWorkState = atom<number>({
  key: "NumberOfAdminWork",
  default: 0,
});

export const selectedTypeOnSearchState = atom<string>({
  key: "SelectedTypeOnSearch",
  default: "CABINET",
});

export const targetUserInfoState = atom<UserInfo>({
  key: "TargetUserInfo",
  default: undefined,
});

interface AdminDetailType {
  type: string;
  data: string;
}

export const selectAdminDetailState = atom<AdminDetailType>({
  key: "AdminDetailInfo",
  default: {
    type: "",
    data: "",
  },
});

export const brokenCabinetListState = atom<ITableData[]>({
  key: "brokenCabinetList",
  default: [],
});

export const overdueCabinetListState = atom<ITableData[]>({
  key: "overdueCabinetList",
  default: [],
});

export const bannedUserListState = atom<ITableData[]>({
  key: "bannedUserList",
  default: [],
});

export const selectedClubInfoState = atom<ClubUserDto | null>({
  key: "selectedClub",
  default: null,
});

export const serverTimeState = atom<Date>({
  key: "serverTime",
  default: new Date(),
});
