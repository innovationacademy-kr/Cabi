import { CabinetInfoResponseDto } from './cabinet.info.response.dto';

/**
 * 특정 층에 존재하는 사물함 정보
 */
export class LentInfoResponseDto {
  section: string[]; // 사물함의 섹션 종류 (오아시스 등)
  cabinets: CabinetInfoResponseDto[]; // 해당 섹션에 존재하는 사물함들
}
