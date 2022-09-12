import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lentCabinetInfoDto } from 'src/cabinet/dto/cabinet-lent-info.dto';
import { UserSessionDto } from './dto/user.session.dto';
import { IAuthRepository } from './repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async checkUser(user: UserSessionDto): Promise<lentCabinetInfoDto> {
    try {
      return this.authRepository.checkUser(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
