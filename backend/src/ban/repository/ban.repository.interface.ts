import BanLog from 'src/entities/ban.log.entity';
import Lent from 'src/entities/lent.entity';

export interface IBanRepository {
  /**
   * 해당 유저의 가장 늦은 unbanned 날짜를 가져옴. 밴 당한적이 없다면 null 반환함.
   *
   * @param user_id 유저 ID
   */
  getUnbanedDate(user_id: number): Promise<Date | null>;

  /**
   * Today + ban_day 만큼 unbanned_date주어 ban_log 테이블에 값 추가.
   * @param lent
   * @param ban_day
   * @param is_penalty
   */
  addToBanLogByUserId(
    lent: Lent,
    ban_day: number,
    is_penalty: boolean,
  ): Promise<void>;

  /**
   * user_id를 받아 유저의 ban log들을 반환.
   * @param user_id
   */
  getBanLogByUserId(user_id: number): Promise<BanLog[]>;

  // /**
  //  * Blackhole에 빠진 유저의 BanLog를 업데이트합니다.
  //  * @param user
  //  * @param new_user_id
  //  */
  // updateBanLogOfBlackholedUser(user: UserDto, new_user_id: number): Promise<void>;
}
