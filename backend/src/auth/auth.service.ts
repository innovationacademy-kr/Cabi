import { Inject, Injectable } from '@nestjs/common';
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
  ) {}

  async addUserIfNotExists(user: UserSessionDto): Promise<boolean> {
    const find = await this.authRepository.addUserIfNotExists(user);
    const is_local = this.configService.get<boolean>('is_local');
    if (!find && !is_local) this.eventEmitter.emit('user.created', user);
    return find;
  }

  async checkUserBorrowed(user: UserDto): Promise<boolean> {
    return this.authRepository.checkUserBorrowed(user);
  }
}
