import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserLentResponseDto } from 'src/dto/response/lent.user.response.dto';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { UserDto } from 'src/dto/user.dto';
import UserStateType from 'src/enums/user.state.type.enum';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { IUserRepository } from './repository/user.repository.interface';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
    private readonly cabinetInfoService: CabinetInfoService,
  ) {}

  async getCabinetByUserId(
    userId: number,
  ): Promise<MyCabinetInfoResponseDto | null> {
    this.logger.debug(`Called ${this.getCabinetByUserId.name}`);
    const cabinetExtendDto = await this.userRepository.getCabinetByUserId(
      userId,
    );
    const lent_info = await this.cabinetInfoService.getLentUsers(
      cabinetExtendDto.cabinet_id,
    );
    return {
      ...cabinetExtendDto,
      lent_info,
    };
  }

  async checkUserBorrowed(user: UserDto): Promise<UserLentResponseDto> {
    this.logger.debug(`Called ${this.checkUserBorrowed.name}`);
    const cabinet_id = await this.userRepository.checkUserBorrowed(
      user.user_id,
    );
    return {
      cabinet_id: cabinet_id,
      user_id: user.user_id,
      intra_id: user.intra_id,
    };
  }

  async updateUserState(user_id: number, state: UserStateType): Promise<void> {
    this.logger.debug(`Called ${this.updateUserState.name}`);
    this.userRepository.updateUserState(user_id, state);
  }

  async getMinUserId(): Promise<number> {
    this.logger.debug(`Called ${this.getMinUserId.name}`);
    return await this.userRepository.getMinUserId();
  }

  async updateUserInfo(
    user_id: number,
    new_user: UserDto,
    new_state: UserStateType,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateUserInfo.name}`);
    await this.updateUserState(user_id, new_state);
    await this.userRepository.updateUserInfo(user_id, new_user);
  }

  async getAllUser(): Promise<UserDto[]> {
    this.logger.debug(`Called ${this.getAllUser.name}`);
    return await this.userRepository.getAllUser();
  }

  async deleteUser(user: UserDto): Promise<void> {
    this.logger.debug(`Called ${this.deleteUser.name}`);
    await this.userRepository.deleteUser(user);
  }
}
