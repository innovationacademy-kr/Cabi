import CabinetStatusType from 'src/enums/cabinet.status.type.enum';

export class CabinetInfoDto {
  cabinet_id: number;
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  status: CabinetStatusType;
}
