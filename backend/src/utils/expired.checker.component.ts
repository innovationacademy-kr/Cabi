import { Inject, Injectable, Logger } from '@nestjs/common';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { LentService } from '../lent/lent.service';
import { EmailSender } from './email.sender.component';
import {
  Transactional,
  Propagation,
  runOnTransactionComplete,
  IsolationLevel,
} from 'typeorm-transactional';
import Lent from 'src/entities/lent.entity';
import { ConfigService } from '@nestjs/config';
import { DateCalculator } from './date.calculator.component';

@Injectable()
export class ExpiredChecker {
  private logger = new Logger(ExpiredChecker.name);
  constructor(
    private readonly lentService: LentService,
    private readonly emailsender: EmailSender,
    private cabinetInfoService: CabinetInfoService,
    private dateCalculator: DateCalculator,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.REPEATABLE_READ,
  })
  async checkExpiredCabinetEach(lent: Lent) {
    const days = await this.dateCalculator.calDateDiff(
      lent.expire_time,
      new Date(),
    );
    if (days >= this.configService.get<number>('expire_term.soonoverdue')) {
      if (days > 0) {
        if (lent.cabinet.status !== CabinetStatusType.EXPIRED) {
          await this.cabinetInfoService.updateCabinetStatus(
            lent.lent_cabinet_id,
            CabinetStatusType.EXPIRED,
          );
        }
      }
      this.emailsender.mailing(lent.user.intra_id, days);
    }
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }
}
