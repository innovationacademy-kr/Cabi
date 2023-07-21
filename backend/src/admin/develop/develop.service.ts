import { Inject, Injectable } from '@nestjs/common';
import { IAdminDevelopRepository } from 'src/admin/develop/repository/develop.repository.interface';

@Injectable()
export class AdminDevelopService {
  constructor(
    @Inject('IAdminDevelopRepository')
    private adminDevelopRepository: IAdminDevelopRepository,
  ) {}

  /**
   * 해당 유저의 role을 1(Admin)로 설정합니다.
   *
   * @param email 해당 유저의 google email.
   * @returns boolean
   */
  async setUserToAdminByEmail(email: string): Promise<boolean> {
    return await this.adminDevelopRepository.setUserToAdminByEmail(email);
  }
}
