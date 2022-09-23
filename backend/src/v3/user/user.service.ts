import { Inject, Injectable, Logger } from '@nestjs/common';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { IUserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async getCabinetByUserId(
    userId: number,
  ): Promise<MyCabinetInfoResponseDto | null> {
    return await this.userRepository.getCabinetByUserId(userId);
  }
}
