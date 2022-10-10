import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { LentTools } from '../lent/lent.component';
import { LentService } from '../lent/lent.service';
import { EmailSender } from './email.sender.component';
import {
  Transactional,
  Propagation,
  runOnTransactionComplete,
} from 'typeorm-transactional';
import Lent from 'src/entities/lent.entity';

@Injectable()
export class ExpiredChecker {
  private logger = new Logger(ExpiredChecker.name);
  constructor(
    @Inject(forwardRef(() => LentTools))
    private readonly lentTools: LentTools,
    @Inject(forwardRef(() => LentService))
    private readonly lentService: LentService,
    private readonly emailsender: EmailSender,
    private cabinetInfoService: CabinetInfoService,
  ) {}

  async getExpiredDays(expire_time: Date): Promise<number> {
    this.logger.debug(
      `Called ${ExpiredChecker.name} ${this.getExpiredDays.name}`,
    );
    const today = new Date();
    const diffDatePerSec = today.getTime() - expire_time.getTime();
    const days = Math.floor(diffDatePerSec / 1000 / 60 / 60 / 24);
    return days;
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async checkExpiredCabinetEach(lent: Lent) {
    const days = await this.getExpiredDays(lent.expire_time);
    if (days >= 0) {
      if (days > 0 && days < 15) {
        await this.cabinetInfoService.updateCabinetStatus(
          lent.lent_cabinet_id,
          CabinetStatusType.EXPIRED,
        );
      }
      else if (days >= 15) {
        await this.cabinetInfoService.updateCabinetStatus(
          lent.lent_cabinet_id,
          CabinetStatusType.BANNED,
        );
        await this.lentService.returnCabinet({
          user_id: lent.lent_user_id,
          intra_id: lent.user.intra_id,
        });
      }
      this.emailsender.mailing(lent.user.intra_id, days);
    }
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async checkExpiredLent() {
    this.logger.debug(
      `Called ${ExpiredChecker.name} ${this.checkExpiredLent.name}`,
    );
    const lentList = await Promise.all(await this.lentTools.getAllLent());
    lentList.forEach(async (lent: Lent) => {
      await this.checkExpiredCabinetEach(lent);
    });
  }
}
