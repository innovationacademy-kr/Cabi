import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LentCabinetInfoDto } from 'src/cabinet/dto/cabinet.lent.info.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { UserSessionDto } from './dto/user.session.dto';
import { IAuthRepository } from './repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async checkUser(user: UserSessionDto): Promise<LentCabinetInfoDto> {
    try {
      return this.authRepository.checkUser(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllUser(): Promise<UserDto[]> {
    try {
      return this.authRepository.getAllUser();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
