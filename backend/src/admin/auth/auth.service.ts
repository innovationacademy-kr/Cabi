import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IAuthRepository } from './repository/auth.repository.interface';
import { ConfigService } from '@nestjs/config';
import { AdminUserDto } from '../dto/admin.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addUserIfNotExists(admin_user: AdminUserDto): Promise<boolean> {
    const find = await this.authRepository.addUserIfNotExists(
      admin_user,
    );
    await this.cacheManager.set(`user-${admin_user.email}`, true, { ttl: 0 });
    return find;
  }

  async checkUserExists(email: string): Promise<boolean> {
    const exist = await this.cacheManager.get<boolean>(`admin_user-${email}`);
    if (exist === undefined) {
      const result = await this.authRepository.checkUserExists(email);
      await this.cacheManager.set(`admin_user-${email}`, result, { ttl: 0 });
      return result;
    }
    return exist;
  }
}
