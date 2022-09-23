import { UserDto } from "../types/dto/user.dto";
import CabinetType from "../types/enum/cabinet.type.enum";
import CabinetStatus from "../types/enum/cabinet.status.enum";

export interface MockData {
  cabinet_type: CabinetType;
  cabinet_number: number;
  is_expired: boolean;
  lender: UserDto[];
  user: string;
  status: CabinetStatus;
}

const MockDatas: MockData[] = [];

MockDatas[0] = {
  cabinet_type: CabinetType.PRIVATE,
  cabinet_number: 1,
  is_expired: false,
  lender: [
    {
      user_id: 12,
      intra_id: "hybae",
    },
  ],
  status: CabinetStatus.FULL,
  user: "hybae",
};

MockDatas[1] = {
  cabinet_type: CabinetType.PRIVATE,
  cabinet_number: 2,
  is_expired: false,
  lender: [
    {
      user_id: 13,
      intra_id: "seuan",
    },
  ],
  status: CabinetStatus.FULL,
  user: "seuan",
};

MockDatas[2] = {
  cabinet_type: CabinetType.PRIVATE,
  cabinet_number: 3,
  is_expired: true,
  lender: [
    {
      user_id: 134,
      intra_id: "seuan2",
    },
  ],
  status: CabinetStatus.EXPIRED,
  user: "seuan2",
};

MockDatas[3] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 4,
  is_expired: false,
  lender: [],
  status: CabinetStatus.AVAILABLE,
  user: "",
};

MockDatas[4] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 5,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
    {
      user_id: 15,
      intra_id: "seuan4",
    },
  ],
  status: CabinetStatus.AVAILABLE,
  user: "seuan3",
};

MockDatas[5] = {
  cabinet_type: CabinetType.PRIVATE,
  cabinet_number: 6,
  is_expired: false,
  lender: [],
  status: CabinetStatus.AVAILABLE,
  user: "seuan4",
};

MockDatas[6] = {
  cabinet_type: CabinetType.PRIVATE,
  cabinet_number: 7,
  is_expired: false,
  lender: [
    {
      user_id: 16,
      intra_id: "hybae2",
    },
  ],
  status: CabinetStatus.FULL,
  user: "hybae2",
};

MockDatas[7] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 8,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
  ],
  status: CabinetStatus.AVAILABLE,
  user: "seuan3",
};
MockDatas[8] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 9,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
    {
      user_id: 15,
      intra_id: "seuan4",
    },
    {
      user_id: 16,
      intra_id: "seuan4",
    },
  ],
  status: CabinetStatus.FULL,
  user: "seuan3",
};

MockDatas[9] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 10,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
    {
      user_id: 15,
      intra_id: "seuan4",
    },
    {
      user_id: 16,
      intra_id: "seuan4",
    },
  ],
  status: CabinetStatus.FULL,
  user: "seuan3",
};

MockDatas[10] = {
  cabinet_type: CabinetType.PRIVATE,
  cabinet_number: 11,
  is_expired: false,
  lender: [],
  status: CabinetStatus.BANNED,
  user: "seuan3",
};

MockDatas[11] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 12,
  is_expired: false,
  lender: [],
  status: CabinetStatus.BROKEN,
  user: "seuan3",
};

MockDatas[12] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 13,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
    {
      user_id: 15,
      intra_id: "seuan4",
    },
    {
      user_id: 16,
      intra_id: "seuan4",
    },
  ],
  status: CabinetStatus.FULL,
  user: "seuan3",
};

MockDatas[13] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 14,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
    {
      user_id: 15,
      intra_id: "seuan4",
    },
    {
      user_id: 16,
      intra_id: "seuan4",
    },
  ],
  status: CabinetStatus.FULL,
  user: "seuan3",
};

MockDatas[14] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 15,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
    {
      user_id: 15,
      intra_id: "seuan4",
    },
    {
      user_id: 16,
      intra_id: "seuan4",
    },
  ],
  status: CabinetStatus.FULL,
  user: "seuan3",
};

MockDatas[15] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 16,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
    {
      user_id: 15,
      intra_id: "seuan4",
    },
    {
      user_id: 16,
      intra_id: "seuan4",
    },
  ],
  status: CabinetStatus.FULL,
  user: "seuan3",
};

MockDatas[16] = {
  cabinet_type: CabinetType.SHARE,
  cabinet_number: 17,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
    {
      user_id: 15,
      intra_id: "seuan4",
    },
    {
      user_id: 16,
      intra_id: "seuan4",
    },
  ],
  status: CabinetStatus.FULL,
  user: "seuan3",
};

export default MockDatas;
