import { UserDto } from "@/types/dto/user.dto";
import { atom } from "recoil";

export const userInfoState = atom<UserDto>({
  key: "UserInfo",
  default: {
    cabinet_id: -1,
    user_id: -1,
    intra_id: "default",
  },
});
