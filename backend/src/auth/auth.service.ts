import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserDto } from 'src/dto/user.dto';
import { IAuthRepository } from './repository/auth.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
    private eventEmitter: EventEmitter2,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addUserIfNotExists(user: UserSessionDto): Promise<boolean> {
    const find = await this.authRepository.addUserIfNotExists(
      user,
      user.blackholed_at,
    );
    const is_local = this.configService.get<boolean>('is_local');
    if (!find && !is_local) this.eventEmitter.emit('user.created', user);
    await this.cacheManager.set(`user-${user.user_id}`, true, { ttl: 0 });
    return find;
  }

  async checkUserBorrowed(user: UserDto): Promise<boolean> {
    return this.authRepository.checkUserBorrowed(user);
  }

  async checkUserExists(user_id: number): Promise<boolean> {
    const exist = await this.cacheManager.get<boolean>(`user-${user_id}`);
    if (exist === undefined) {
      const result = await this.authRepository.checkUserExists(user_id);
      await this.cacheManager.set(`user-${user_id}`, result, { ttl: 0 });
      return result;
    }
    return exist;
  }
}
