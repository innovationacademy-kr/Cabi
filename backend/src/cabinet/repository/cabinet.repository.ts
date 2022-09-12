import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { lentCabinetInfoDto } from '../dto/cabinet-lent-info.dto';
import { CabinetListDto } from '../dto/cabinet-list.dto';
import { LentInfoDto } from '../dto/lent-info.dto';

export abstract class ICabinetRepository {
  /**
   * 운용 중인 전체 사물함에 대한 정보를 가져옵니다.
   *
   * @return CabinetListDto
   */
  abstract getAllCabinets(): Promise<CabinetListDto>;

  /**
   * 사물함을 렌트 중인 유저 정보들을 가져옵니다.
   *
   * @return LentInfoDto[]
   */
  abstract getLentUsers(): Promise<LentInfoDto[]>;

  /**
   * 사물함의 현재 상태를 가져옵니다.
   *
   * @return number
   */
  abstract checkCabinetStatus(cabinet_id: number): Promise<number>;

  /**
   * 본인 정보 및 렌트 정보 - 리턴 페이지
   * @return lentCabinetInfoDto
   */
  abstract getUser(user: UserSessionDto): Promise<lentCabinetInfoDto>;

  /**
   * lent 값을 생성합니다.
   * @return
   */
  abstract createLent(
    cabinet_id: number,
    user: UserSessionDto,
  ): Promise<{ errno: number }>;

  /**
   * lent_log 값 생성 후 lent 값 삭제
   *
   */
  abstract createLentLog(user_id: number, intra_id: string): Promise<void>;

  /**
   * 대여기간 연장 수행.
   *
   */
  abstract activateExtension(user: UserSessionDto): Promise<void>;
}
