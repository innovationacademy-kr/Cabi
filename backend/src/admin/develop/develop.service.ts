import { Inject, Injectable } from "@nestjs/common";
import { IAdminDevelopRepository } from "src/admin/develop/repository/develop.repository.interface";
import { AdminUserDto } from "src/admin/dto/admin.user.dto";

@Injectable()
export class AdminDevelopService {
    constructor(
        @Inject('IAdminDevelopRepository')
        private adminDevelopRepository: IAdminDevelopRepository,
    ) {}
    
  /**
   * 해당 유저의 role을 1(Admin)로 설정합니다.
   *
   * @param adminUser 해당 구글 로그인 유저의 email, role
   * @returns Boolean
   */
    async setUserToAdmin(adminUser: AdminUserDto): Promise<boolean> {
        return await this.adminDevelopRepository.setUserToAdmin(adminUser);
    }
}