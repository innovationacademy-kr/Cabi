import { CabinetDto } from 'src/dto/cabinet.dto';
import { LentDto } from 'src/dto/lent.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { CabinetsPerSectionResponseDto } from 'src/dto/response/cabinet.per.section.response.dto';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { QueryRunner } from 'typeorm';

export interface ICabinetInfoRepository {
  /**
   * 존재하는 건물 정보를 가져옵니다.
   *
   * @return string[]
   */
  getLocation(): Promise<string[]>;

  /**
   * 건물에 존재하는 층 정보를 가져옵니다.
   *
   * @param location
   * @return number[]
   */
  getFloors(location: string): Promise<number[]>;

  /**
   * 특정 건물과 층에 있는 정보들을 가져옵니다.
   *
   * @return CabinetsPerSectionResponseDto[]
   */
  getFloorInfo(
    location: string,
    floor: number,
  ): Promise<CabinetsPerSectionResponseDto[]>;

  /**
   * 특정 건물과 층에 있는 section 정보를 가져옵니다.
   *
   * @param location
   * @param floor
   * @return string[]
   */
  getSectionInfo(location: string, floor: number): Promise<string[]>;

  /**
   * 특정 사물함의 상세정보를 가져옵니다.
   *
   * @return CabinetInfoResponstDto
   */
  getCabinetResponseInfo(cabinet_id: number): Promise<CabinetInfoResponseDto>;

  /**
   * 특정 사물함의 기본정보를 가져옵니다.
   *
   * @param cabinet_id
   * @return CabinetDto
   */
  getCabinetInfo(cabinet_id: number): Promise<CabinetDto>;

  /**
   * 특정 사물함의 lent 정보들을 가져옵니다.
   *
   * @return LentDto[]
   */
  getLentUsers(cabinet_id: number): Promise<LentDto[]>;

  /**
   * 특정 사물함의 status를 변경합니다.
   *
   * @param cabinet_id
   * @param status
   */
  updateCabinetStatus(
    cabinet_id: number,
    status: CabinetStatusType,
    queryRunner?: QueryRunner,
  ): Promise<void>;
}
