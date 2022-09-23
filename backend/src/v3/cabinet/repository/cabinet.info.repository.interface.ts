import { LentDto } from 'src/dto/lent.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { LentInfoResponseDto } from 'src/dto/response/lent.info.response.dto';

export interface ICabinetInfoRepository {
  /**
   * 특정 건물과 층에 존재하는 사물함의 정보를 가져옵니다.
   *
   * @return LentInfoResponseDto
   */
  getFloorInfo(location: string, floor: number): Promise<LentInfoResponseDto>;

  /**
   * 특정 사물함의 정보를 가져옵니다.
   *
   * @return CabinetInfoResponstDto
   */
  getCabinetResponseInfo(cabinet_id: number): Promise<CabinetInfoResponseDto>;

  /**
   * 특정 사물함의 lent 정보들을 가져옵니다.
   *
   * @return LentDto[]
   */
  getLentUsers(cabinet_id: number): Promise<LentDto[]>;

  /**
   * 특정 사물함의 activation을 변경합니다.
   *
   * @param cabinet_id
   * @param activation
   */
  updateCabinetActivation(
    cabinet_id: number,
    activation: number,
  ): Promise<void>;
}
