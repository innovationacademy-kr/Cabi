import { UserDto } from 'src/dto/user.dto';

export interface IAuthRepository {
  /**
   * 유저가 존재하는지 확인하고 유저가 존재하지 않으면 유저를 추가합니다.
   *
   * @param user 추가될 유저
   * @return boolean 존재했다면 true, 존재하지 않았다면 false
   */
  addUserIfNotExists(user: UserDto): Promise<boolean>;

  /**
   * 유저가 사물함을 빌렸는지 확인합니다.
   *
   * @param user 확인할 유저
   * @return 빌림 여부
   */
  checkUserBorrowed(user: UserDto): Promise<boolean>;
}
