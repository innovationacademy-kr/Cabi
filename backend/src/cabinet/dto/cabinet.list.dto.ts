import { CabinetInfoDto } from './cabinet.info.dto';

export class CabinetListDto {
  location?: Array<string>;
  floor?: Array<Array<number>>;
  section?: Array<Array<Array<string>>>;
  cabinet?: Array<Array<Array<Array<CabinetInfoDto>>>>;
}
