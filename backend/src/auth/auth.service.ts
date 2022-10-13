import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { IAuthRepository } from './repository/auth.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async addUserIfNotExists(user: UserDto): Promise<boolean> {
    const find = await this.authRepository.addUserIfNotExists(user);
    if (!find) this.eventEmitter.emit('user.created', user);
    return find;
  }

  async checkUserBorrowed(user: UserDto): Promise<boolean> {
    return this.authRepository.checkUserBorrowed(user);
  }
}
