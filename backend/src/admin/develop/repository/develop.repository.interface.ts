import { AdminUserDto } from "src/admin/dto/admin.user.dto";

export interface IAdminDevelopRepository {
  /**
   * Dev 환경에서 구글 로그인한 유저 본인의 권한을 관리자로 승격시킵니다.
   *
   * @param admin_user 추가될 어드민
   * @return boolean 존재했다면 true, 존재하지 않았다면 false
   */
  setUserToAdmin(adminUser: AdminUserDto): Promise<boolean>;
}