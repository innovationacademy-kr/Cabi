export class LentCabinetInfoDto {
  lent_id: number;
  lent_cabinet_id: number;
  lent_user_id: number;
  lent_time?: string;
  expire_time?: string;
  extension: boolean;
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  activation: boolean;
}
