interface UserDto {
  user_id: number; // 42 고유 ID
  intra_id: string; // 42 로그인 ID
  email?: string; // 42 이메일 ID (확장성을 위해 옵셔널 필드로 지정)
}

export interface MockData {
  cabinet_type: string;
  cabinet_number: number;
  is_expired: boolean;
  lender: UserDto[];
  isLent: number;
  user: string;
}

const MockDatas: MockData[] = [];

MockDatas[0] = {
  cabinet_type: "PRIVATE",
  cabinet_number: 1,
  is_expired: false,
  lender: [
    {
      user_id: 12,
      intra_id: "hybae",
    },
  ],
  isLent: 1,
  user: "hybae",
};

MockDatas[1] = {
  cabinet_type: "PRIVATE",
  cabinet_number: 2,
  is_expired: false,
  lender: [
    {
      user_id: 13,
      intra_id: "seuan",
    },
  ],
  isLent: 1,
  user: "seuan",
};

MockDatas[2] = {
  cabinet_type: "PRIVATE",
  cabinet_number: 3,
  is_expired: true,
  lender: [
    {
      user_id: 134,
      intra_id: "seuan2",
    },
  ],
  isLent: 0,
  user: "seuan2",
};

MockDatas[3] = {
  cabinet_type: "SHARE",
  cabinet_number: 4,
  is_expired: false,
  lender: [],
  isLent: 0,
  user: "",
};

MockDatas[4] = {
  cabinet_type: "SHARE",
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
  isLent: 1,
  user: "seuan3",
};

MockDatas[5] = {
  cabinet_type: "PRIVATE",
  cabinet_number: 6,
  is_expired: false,
  lender: [],
  isLent: 0,
  user: "seuan4",
};

MockDatas[6] = {
  cabinet_type: "PRIVATE",
  cabinet_number: 7,
  is_expired: false,
  lender: [
    {
      user_id: 16,
      intra_id: "hybae2",
    },
  ],
  isLent: 1,
  user: "hybae2",
};

MockDatas[7] = {
  cabinet_type: "SHARE",
  cabinet_number: 8,
  is_expired: false,
  lender: [
    {
      user_id: 14,
      intra_id: "seuan3",
    },
  ],
  isLent: 1,
  user: "seuan3",
};
MockDatas[8] = {
  cabinet_type: "SHARE",
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
  isLent: 1,
  user: "seuan3",
};

export default MockDatas;
