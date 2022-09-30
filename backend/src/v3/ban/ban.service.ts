import { Inject, Injectable, Logger } from '@nestjs/common';
import { IBanRepository } from './repository/ban.repository.interface';

@Injectable()
export class BanService {
  private logger = new Logger(BanService.name);

  constructor(
    @Inject('IBanRepository') private banRepository: IBanRepository,
  ) {}

  /**
   * 해당 유저가 현재시간 기준으로 밴 당했는지 확인함.
   *
   * @param userId 유저 ID
   * @return boolean
   */
  async isBlocked(userId: number): Promise<boolean> {
    this.logger.debug(`isBlocked : ${userId}`);
    const bannedTime = await this.banRepository.getUnbanedDate(userId);
    if (bannedTime && bannedTime > new Date()) {
      return true;
    }
    return false;
  }
}
