export type locationInfo = {
  location?: Array<string>;
  floor?: Array<Array<number>>;
  section?: Array<Array<Array<string>>>;
  cabinet?: Array<Array<Array<Array<cabinetInfo>>>>;
};

export type cabinetInfo = {
  cabinet_id: number;
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  activation: boolean;
};

export type lentCabinetInfo = {
  lent_id: number;
  lent_cabinet_id: number;
  lent_user_id: number;
  lent_time: string;
  expire_time: string;
  extension: number;
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  activation: boolean;
};

export type lentInfo = {
  lent_id: number;
  lent_cabinet_id: number;
  lent_user_id: number;
  lent_time?: string;
  expire_time?: string;
  extension: boolean;
  intra_id?: string;
};