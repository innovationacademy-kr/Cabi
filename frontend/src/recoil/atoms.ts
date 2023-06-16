import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { staticColNumData } from "@/assets/data/sectionColNumData";
import { ILocationColNum } from "@/assets/data/sectionColNumData";
import { ITableData } from "@/types/dto/admin.dto";
import {
  CabinetBuildingFloorDto,
  CabinetInfo,
  CabinetInfoByLocationFloorDto,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import { UserDto, UserInfo } from "@/types/dto/user.dto";

const { persistAtom } = recoilPersist();

export const userState = atom<UserDto>({
  key: "UserInfo",
  default: {
    cabinetId: -1,
    userId: -1,
    name: "default",
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
//     location: "",
//     floor: -1,
//     section: "",
//     cabinet_memo: "",
//     cabinet_id: -1,
//     cabinet_num: -1,
//     lent_type: "",
//     cabinet_title: "",
//     max_user: -1,
//   },
// });

export const locationsFloorState = atom<CabinetBuildingFloorDto[]>({
  key: "CurrentLocationData",
  default: [],
});

export const currentLocationNameState = atom<string>({
  key: "CurrentLocation",
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const currentFloorNumberState = atom<number>({
  key: "CurrentFloor",
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const currentSectionNameState = atom<string>({
  key: "CurrentSection",
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const currentCabinetIdState = atom<number>({
  key: "CurrentCabinetId",
  default: undefined,
});

export const currentFloorCabinetState = atom<CabinetInfoByLocationFloorDto[]>({
  key: "CurrentFloorData",
  default: [],
});

export const targetCabinetInfoState = atom<CabinetInfo>({
  key: "TargetCabinetInfo",
  default: undefined,
});

export const locationColNumState = atom<ILocationColNum[]>({
  key: "LocationColNum",
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

export const targetCabinetInfoListState = atom<CabinetInfo[]>({
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
