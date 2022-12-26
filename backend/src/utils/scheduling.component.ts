import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpiredChecker } from './expired.checker.component';
import { LeaveAbsence } from './leave.absence.component';
import { LentTools } from 'src/lent/lent.component';

@Injectable()
export class Scheduling {
  private readonly logger: Logger = new Logger(Scheduling.name);
  constructor(
    private readonly expiredChecker: ExpiredChecker,
    private readonly leaveAbsence: LeaveAbsence,
    private readonly lentTools: LentTools,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkLents() {
    this.logger.debug(`Called ${ExpiredChecker.name} ${this.checkLents.name}`);
    const lentList = await Promise.all(await this.lentTools.getAllLent());
    for await (const lent of lentList) {
      if (lent.expire_time === null) continue;
      await this.expiredChecker.checkExpiredCabinetEach(lent);
      await this.leaveAbsence.isExpired(lent);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
  }
}
