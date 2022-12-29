import { UserDto } from "@/types/dto/user.dto";
import {
  CabinetInfo,
  CabinetInfoByLocationFloorDto,
  MyCabinetInfoResponseDto,
  CabinetLocationFloorDto,
} from "@/types/dto/cabinet.dto";
import { atom } from "recoil";
import CabinetStatus from "@/types/enum/cabinet.status.enum";

export const userState = atom<UserDto>({
  key: "UserInfo",
  default: {
    cabinet_id: -1,
    user_id: -1,
    intra_id: "default",
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

export const locationsFloorState = atom<CabinetLocationFloorDto[]>({
  key: "CurrentLocationData",
  default: [],
});

export const currentLocationNameState = atom<string>({
  key: "CurrentLocation",
  default: "새롬관",
});

export const currentFloorNumberState = atom<number>({
  key: "CurrentFloor",
  default: -1,
});

export const currentSectionNameState = atom<string>({
  key: "CurrentSection",
  default: undefined,
});

export const currentFloorCabinetState = atom<CabinetInfoByLocationFloorDto[]>({
  key: "CurrentFloorData",
  default: [],
});
