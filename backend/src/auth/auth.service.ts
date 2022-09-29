import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { IAuthRepository } from './repository/auth.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
  ) {}

  async addUserIfNotExists(user: UserDto): Promise<boolean> {
    return this.authRepository.addUserIfNotExists(user);
  }

  async checkUserBorrowed(user: UserDto): Promise<boolean> {
    return this.authRepository.checkUserBorrowed(user);
  }
}
