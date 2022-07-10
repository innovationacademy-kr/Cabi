export interface user {
  user_id: number;
  intra_id: string;
}
export interface userInfo extends user {
  auth?: number;
  email: string;
  phone?: string;
  access: string;
  refresh: string;
};

export interface lent {
  lent_id: number;
  lent_cabinet_id: number;
  lent_user_id: number;
  lent_time?: string;
  expire_time?: string;
  extension: boolean;
}

export interface lentInfo extends lent {
  intra_id?: string;
};

//lent 된 Cabinet 하나의 Info
export interface lentCabinetInfo extends lent {
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  activation: boolean;
};
//cabinet & lent table
export interface cabinetInfo extends lentCabinetInfo {
  cabinet_id: number;
};
//all cabinet info
export interface cabinetListInfo {
  location?: Array<string>;
  floor?: Array<Array<number>>;
  section?: Array<Array<Array<string>>>;
  cabinet?: Array<Array<Array<Array<cabinetInfo>>>>;
};
//slack user
export interface slackUser {
  id: string;
  name: string;
};

//variables

// //users logged in
// export let userList: Array<userInfo> = [];

//all cabinet for rent
// export let cabinetList: cabinetListInfo = {
//   location: [],
//   floor: [],
//   section: [],
//   cabinet: [],
// };
//slack user info list
export let slackUserList: Array<slackUser> = [];

// eventInfo
export interface eventInfo {
  event_id: number,
  event_name: string,
  intra_id: string,
  isEvent: boolean
};

export interface overUserInfo extends user {
  auth: number;
  email: string;
  lent_id: number;
  cabinet_id: number;
}

export interface banUserInfo extends user {
  ban_id: number;
  cabinet_id: number;
  bannedDate: string;
  unBannedDate: string;
};

export interface banUserAddInfo extends user {
  cabinet_id: number | null;
};

export interface banCabinetInfo {
  user_id: number;
  cabinet_id: number;
  lent_id: number;
};
