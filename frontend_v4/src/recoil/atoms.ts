import { UserDto } from "@/types/dto/user.dto";
import {
  CabinetInfo,
  CabinetInfoByLocationFloorDto,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import { atom } from "recoil";
import CabinetStatus from "@/types/enum/cabinet.status.enum";

export const userInfoState = atom<UserDto>({
  key: "UserInfo",
  default: {
    cabinet_id: -1,
    user_id: -1,
    intra_id: "default",
  },
});

export const myLentInfoState = atom<MyCabinetInfoResponseDto>({
  key: "MyLentInfo",
  default: {
    status: CabinetStatus.AVAILABLE,
    lent_info: [],
    location: "",
    floor: -1,
    section: "",
    cabinet_memo: "",
    cabinet_id: -1,
    cabinet_num: -1,
    lent_type: "",
    cabinet_title: "",
    max_user: -1,
  },
});

export const currentFloorState = atom<number>({
  key: "CurrentFloor",
  default: -1,
});

export const currentLocationState = atom<string>({
  key: "CurrentLocation",
  default: "",
});

export const currentFloorDataState = atom<CabinetInfoByLocationFloorDto>({
  key: "CurrentFloorData",
  default: {
    section: "",
    cabinets: [],
  },
});
