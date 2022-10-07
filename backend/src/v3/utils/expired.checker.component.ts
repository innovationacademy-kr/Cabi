import { Injectable, Logger, ParseIntPipe, PreconditionFailedException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import CabinetStatusType from "src/enums/cabinet.status.type.enum";
import { CabinetInfoService } from "../cabinet/cabinet.info.service";
import { LentTools } from "../lent/lent.component";
import { LentService } from "../lent/lent.service";
import { EmailSender } from "./email.sender.component";

@Injectable()
export class ExpiredChecker {
    private logger = new Logger(ExpiredChecker.name);
    constructor (
        private readonly lentTools: LentTools,
        private readonly lentService: LentService,
        private readonly emailsender: EmailSender,
        private cabinetInfoService: CabinetInfoService,
    ) {}

    async getExpiredDays(expire_time: Date): Promise<number> {
        this.logger.debug(`Called ${ExpiredChecker.name} ${this.getExpiredDays.name}`);
        const today = new Date();
        const diffDatePerSec = today.getTime() - expire_time.getTime();
        const days = Math.floor(diffDatePerSec / 1000 / 60 / 60 / 24);
        return (days);
    }

    @Cron(CronExpression.EVERY_DAY_AT_9PM)
    async checkExpiredLent() {
        this.logger.debug(`Called ${ExpiredChecker.name} ${this.checkExpiredLent.name}`);
        const lentList = await Promise.all(await this.lentTools.getAllLent());
        lentList.forEach(async (lent) => {
            const days = await this.getExpiredDays(lent.expire_time);
            if (days >= 0) {
                if (days > 0) 
                    await this.cabinetInfoService.updateCabinetStatus(lent.lent_cabinet_id, CabinetStatusType.EXPIRED);
                else if (days == 15) {
                    await this.cabinetInfoService.updateCabinetStatus(lent.lent_cabinet_id, CabinetStatusType.BANNED);
                    await this.lentService.returnCabinet({user_id: lent.lent_user_id, intra_id: lent.user.intra_id});
                }
                this.emailsender.mailing(lent.user.intra_id, days);
            }
        })
    }
}