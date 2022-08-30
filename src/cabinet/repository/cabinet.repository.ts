import { UserSessionDto } from 'src/auth/dto/user.session.dto';
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
