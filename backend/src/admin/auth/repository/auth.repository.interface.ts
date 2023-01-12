import { AdminUserDto } from 'src/admin/dto/admin.user.dto';
import AdminUserRole from 'src/admin/enums/admin.user.role.enum';

export interface IAdminAuthRepository {
  /**
   * 어드민이 존재하는지 확인하고 유저가 존재하지 않으면 어드민을 추가합니다.
   *
   * @param admin_user 추가될 어드민
   * @return boolean 존재했다면 true, 존재하지 않았다면 false
   */
  addUserIfNotExists(adminUser: AdminUserDto): Promise<boolean>;

  /**
   * 어드민이 존재하는지 여부만 확인합니다.
   *
   * @param email 확인할 어드민의 이메일
   * @return 존재 여부
   */
  checkUserExists(email: string): Promise<boolean>;

  /**
   * 이메일을 기준으로 해당 admin_user의 role을 가져옵니다.
   *
   * @param email 확인할 어드민의 이메일
   * @return 권한 (role == 0 || 1 || 2)
   */
  getAdminUserRole(email: string): Promise<AdminUserRole>;
}
