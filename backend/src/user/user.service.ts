import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { Cache } from 'cache-manager';
import { UserLentResponseDto } from 'src/dto/response/lent.user.response.dto';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { UserDto } from 'src/dto/user.dto';
import UserStateType from 'src/enums/user.state.type.enum';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { IUserRepository } from './repository/user.repository.interface';
import { UserSessionDto } from 'src/dto/user.session.dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly cabinetInfoService: CabinetInfoService,
  ) {}

  async getCabinetByUserId(
    userId: number,
  ): Promise<MyCabinetInfoResponseDto | null> {
    this.logger.debug(`Called ${this.getCabinetByUserId.name}`);
    const cabinetExtendDto = await this.userRepository.getCabinetByUserId(
      userId,
    );
    if (!cabinetExtendDto) {
      return null;
    }
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
    await this.userRepository.updateUserState(user_id, state);
  }

  async getAllUser(): Promise<UserSessionDto[]> {
    this.logger.debug(`Called ${this.getAllUser.name}`);
    return await this.userRepository.getAllUser();
  }

  async getCabinetDtoByUserId(user_id: number): Promise<CabinetDto | null> {
    this.logger.debug(`Called ${this.getCabinetDtoByUserId.name}`);
    return await this.userRepository.getCabinetDtoByUserId(user_id);
  }

  async deleteUserById(user_id: number): Promise<void> {
    this.logger.debug(`Called ${this.deleteUserById.name}`);
    await this.cacheManager.del(`user-${user_id}`);
    await this.userRepository.deleteUserById(user_id);
  }

  async updateBlackholeDate(user_id: number, blackhole_date?: Date): Promise<void> {
    this.logger.debug(`Called ${this.updateBlackholeDate.name}`);
    await this.userRepository.updateBlackholeDate(user_id, blackhole_date);
  }
}
