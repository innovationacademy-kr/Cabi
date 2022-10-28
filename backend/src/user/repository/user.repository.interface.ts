import { CabinetDto } from 'src/dto/cabinet.dto';
import { CabinetExtendDto } from 'src/dto/cabinet.extend.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';

export interface IUserRepository {
  /**
   * 특정 유저가 대여한 사물함 정보를 가져옵니다.
   *
   * @param userId 유저 아이디
   * @return CabinetExtendDto | null
   */
  getCabinetByUserId(userId: number): Promise<CabinetExtendDto | null>;

  /**
   * 유저가 사물함을 빌렸는지 확인합니다.
   *
   * @param user 확인할 유저
   * @return 빌린 사물함 고유 ID (대여하지 않았을 경우 -1)
   */
  checkUserBorrowed(userId: number): Promise<number>;

  /**
   * DB에 존재하는 모든 사용자를 가져옵니다.
   *
   * @return UserDto[]
   */
  getAllUser(): Promise<UserSessionDto[]>;

  /**
   * 특정 유저가 대여한 사물함 정보를 CabinetDto로 가져옵니다.
   * @param user_id
   * @return CabinetDto | null
   */
  getCabinetDtoByUserId(user_id: number): Promise<CabinetDto | null>;

  /**
   * 해당 유저를 DB에서 제거합니다.
   * @param user_id
   */
  deleteUserById(user_id: number): Promise<void>;

  /**
   * 해당 유저의 blackhole_date를 업데이트합니다.
   * @param user_id
   */
  updateBlackholeDate(user_id: number, blackhole_date: Date): Promise<void>;
}
