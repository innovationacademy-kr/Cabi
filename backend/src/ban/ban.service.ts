import { Inject, Injectable, Logger } from '@nestjs/common';
import Lent from 'src/entities/lent.entity';
import { UserService } from '../user/user.service';
import { IBanRepository } from './repository/ban.repository.interface';
import {
  Transactional,
  Propagation,
  runOnTransactionComplete,
  IsolationLevel,
} from 'typeorm-transactional';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';
import LentType from 'src/enums/lent.type.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BanService {
  private logger = new Logger(BanService.name);

  constructor(
    @Inject('IBanRepository')
    private banRepository: IBanRepository,
    private userService: UserService,
    private cabinetInfoService: CabinetInfoService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  /**
   * 해당 유저가 현재시간 기준으로 밴 당했는지 확인함.
   *
   * @param user_id 유저 ID
   * @return boolean
   */
  async isBlocked(user_id: number, cabinet_id: number): Promise<Date> {
    this.logger.debug(`Called ${BanService.name} ${this.isBlocked.name}`);
    this.logger.debug(`isBlocked : ${user_id}`);
    const cabinet =
      cabinet_id === undefined
        ? undefined
        : await this.cabinetInfoService.getCabinetInfo(cabinet_id);
    const unbannedTime = await this.banRepository.getUnbanedDate(user_id);
    if (unbannedTime && unbannedTime > new Date()) {
      if (cabinet !== undefined)
        if (
          cabinet.lent_type === LentType.PRIVATE &&
          (await this.banRepository.getIsPenalty(user_id)) === true
        )
          return undefined;
      return unbannedTime;
    }
    return undefined;
  }

  /**
   * 공유사물함을 대여 후 72시간 이내 중도 이탈한 유저에게 패널티 부여.
   * @param user_id
   * @param lent_time
   */
  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async blockingDropOffUser(lent: Lent): Promise<void> {
    this.logger.debug(
      `Called ${BanService.name} ${this.blockingDropOffUser.name}`,
    );
    const now = new Date();
    const target = new Date(lent.lent_time.getTime());
    target.setDate(
      target.getDate() + this.configService.get<number>('penalty_day_share'),
    );
    if (now < target) {
      await this.blockingUser(
        lent,
        this.configService.get<number>('penalty_day_share'),
        true,
      );
    }
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }

  /**
   * 해당 유저에게 ban_day만큼 밴을 부가.
   * @param user_id
   * @param ban_day
   */
  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async blockingUser(
    lent: Lent,
    ban_day: number,
    is_penalty: boolean,
  ): Promise<void> {
    this.logger.debug(`Called ${BanService.name} ${this.blockingUser.name}`);
    // 1. Today + ban_day 만큼 unbanned_date주어 ban_log 테이블에 값 추가.
    await this.banRepository.addToBanLogByUserId(lent, ban_day, is_penalty);
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }

  /**
   * 날짜 차이 계산
   * @param begin
   * @param end
   * @returns days
   */
  async calDateDiff(begin: Date, end: Date): Promise<number> {
    this.logger.debug(`Called ${BanService.name} ${this.calDateDiff.name}`);
    const diffDatePerSec = end.getTime() - begin.getTime();
    const days = Math.floor(diffDatePerSec / 1000 / 60 / 60 / 24);
    return days;
  }

  /**
   * 유저의 누적 연체일을 계산
   * @param user_id
   */
  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async addOverdueDays(user_id: number): Promise<number> {
    this.logger.debug(`Called ${BanService.name} ${this.addOverdueDays.name}`);
    const banLog = await this.banRepository.getBanLogByUserId(user_id);
    let accumulate = 0;
    for (const log of banLog) {
      if (log.is_penalty == false)
        accumulate += await this.calDateDiff(
          log.banned_date,
          log.unbanned_date,
        );
    }
    return accumulate;
  }
}
