import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserLentResponseDto } from 'src/dto/response/lent.user.response.dto';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { UserDto } from 'src/dto/user.dto';
import { IUserRepository } from './repository/user.repository.interface';

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

  async checkUserBorrowed(user: UserDto): Promise<UserLentResponseDto> {
    const cabinet_id = await this.userRepository.checkUserBorrowed(
      user.user_id,
    );
    return {
      cabinet_id: cabinet_id,
      user_id: user.user_id,
      intra_id: user.intra_id,
    };
  }
}
