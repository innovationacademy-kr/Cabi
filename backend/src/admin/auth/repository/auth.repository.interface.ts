import { AdminUserDto } from 'src/admin/dto/admin.user.dto';

export interface IAuthRepository {
  /**
   * 유저가 존재하는지 확인하고 유저가 존재하지 않으면 유저를 추가합니다.
   *
   * @param user 추가될 유저
   * @return boolean 존재했다면 true, 존재하지 않았다면 false
   */
  addUserIfNotExists(admin_user: AdminUserDto): Promise<boolean>;

  /**
   * 유저가 존재하는지 여부만 확인합니다.
   *
   * @param user_id 확인할 유저의 고유 ID
   * @return 존재 여부
   */
  checkUserExists(email: string): Promise<boolean>;
}
