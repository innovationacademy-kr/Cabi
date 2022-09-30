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
   * @param user_id 유저 ID
   * @return boolean
   */
  async isBlocked(user_id: number): Promise<boolean> {
    this.logger.debug(`Called ${BanService.name} ${this.isBlocked.name}`);
    this.logger.debug(`isBlocked : ${user_id}`);
    const bannedTime = await this.banRepository.getUnbanedDate(user_id);
    if (bannedTime && bannedTime > new Date()) {
      return true;
    }
    return false;
  }

  async blockingUser(user_id: number, ban_day: number): Promise<void> {
    this.logger.debug(`Called ${BanService.name} ${this.blockingUser.name}`);
    // 1. Today + ban_day 만큼 unbanned_date주어 ban_log 테이블에 값 추가.
    await this.banRepository.addToBanLogByUserId(user_id, ban_day);
    // TODO: 2. 해당 user의 state를 BAN으로 변경. (user의 state에도 enum 추가 필요.)
    // await this.userService.updateUserState(user_id, UserStateType.BANNED);
  }
}
