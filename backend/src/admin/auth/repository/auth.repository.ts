import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/admin/dto/admin.user.dto';
import AdminUser from 'src/entities/admin.user.entity';
import { Repository } from 'typeorm';
import { IAuthRepository } from './auth.repository.interface';

export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(AdminUser) private adminUserRepository: Repository<AdminUser>,
  ) {}

  async addUserIfNotExists(
    admin_user: AdminUserDto
  ): Promise<boolean> {
    const find = await this.adminUserRepository.findOne({
      where: {
        email: admin_user.email,
      },
    });
    if (!find) {
      await this.adminUserRepository.save({
        email: admin_user.email,
        role: admin_user.role,
      });
      return false;
    }
    return true;
  }

  async checkUserExists(email: string): Promise<boolean> {
    const result = await this.adminUserRepository
      .createQueryBuilder('au')
      .select(['au.email'])
      .where('au.email = :email', { email })
      .execute();
    return result.length !== 0;
  }
}
