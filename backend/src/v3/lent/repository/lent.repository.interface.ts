import { CabinetDto } from "src/dto/cabinet.dto";
import { UserSessionDto } from "src/dto/user.session.dto";
import Lent from "src/entities/lent.entity";

export abstract class ILentRepository {

  /**
   * 사용자가 사물함을 대여중인지 아닌지를 반환합니다.
   * @param user_id
   * @return boolean
   */
  abstract getIsLent(user_id: number): Promise<boolean>;

  /**
   * 해당 캐비넷을 대여하고 있는 유저의 수를 반환합니다.
   * @param cabinet_id
   * @return number
   */
  abstract getLentUserCnt(cabinet_id: number): Promise<number>;

  /**
   * 특정 user_id로 해당 캐비넷 대여를 시도합니다.
   * 대여에 성공하면 Lent를 반환합니다.
   * @param user_id
   * @param cabinet_id
   * @return Lent
   */
  abstract lentCabinet(user: UserSessionDto, cabinet: CabinetDto): Promise<void>;
}
