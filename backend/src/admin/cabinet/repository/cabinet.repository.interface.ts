import LentType from 'src/enums/lent.type.enum';
import { CabinetFloorDto } from '../../dto/cabinet.floor.dto';

export interface ICabinetRepository {
  /**
   * 전반적인 층별 사물함 현황 (사용 중, 연체, 사용 불가, 미사용) 을 가져옵니다.
   *
   * @returns CabinetFloorDto[]
   */
  getCabinetCountFloor(): Promise<CabinetFloorDto[]>;

  /**
   * section별로 lent된 cabinetid list를 가져옵니다.
   *
   * @param location
   * @param floor
   * @param section
   */
  getCabinetIdBySection(
    location: string,
    floor: number,
    section: string,
  ): Promise<number[]>;

  /**
   * 특정 사물함의 lent_type를 변경합니다.
   *
   * @param cabinetId
   * @param lentType
   */
  updateLentType(cabinetId: number, lentType: LentType): Promise<void>;

  /**
   * 특정 사물함의 StatusNote를 변경합니다.
   *
   * @param cabinetId
   * @param statusNote
   */
  updateStatusNote(cabinetId: number, statusNote: string): Promise<void>;

  /**
   * 특정 사물함의 title을 변경합니다.
   *
   * @param cabinetId
   * @param title
   */
  updateCabinetTitle(cabinetId: number, title: string): Promise<void>;

  /**
   * cabinet이 대여중인 상태인지 확인합니다.
   *
   * @param cabinetId
   */
  cabinetIsLent(cabinetId: number): Promise<boolean>;

  /**
   * 인자로 받은 id의 사물함이 존재하는지 확인합니다.
   *
   * @param cabinetId
   */
  isCabinetExist(cabinetId: number): Promise<boolean>;
}
