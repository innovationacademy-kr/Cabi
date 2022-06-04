export interface locationInfo {
  location?: Array<string>;
  floor?: Array<Array<number>>;
  section?: Array<Array<Array<string>>>;
  cabinet?: Array<Array<Array<Array<cabinetInfo>>>>;
};

export interface cabinetInfo {
  cabinet_id: number;
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  activation: boolean;
};

export interface lent {
  lent_id: number;
  lent_cabinet_id: number;
  lent_user_id: number;
  lent_time?: string;
  expire_time?: string;
  extension: number;
}

export interface lentCabinetInfo extends lent {
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  activation: boolean;
};

export interface lentInfo extends lent {
  intra_id?: string;
};