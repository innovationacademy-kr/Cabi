import { Injectable, Logger } from "@nestjs/common";
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
        return (today.getDate() - expire_time.getDate());
    }

    @Cron(CronExpression.EVERY_DAY_AT_9PM)
    public checkExpiredLent() {
        const lentList = await this.lentTools.getAllLent();
        lentList.forEach(async (lent) => {
            const days = await this.getExpiredDays(lent.expire_time);
            if (days >= 0) {
                if (days > 0) 
                    await this.cabinetInfoService.updateCabinetStatus(lent.cabinet_id, CabinetStatusType.EXPIRED);
                else if (days == 15) {
                    await this.cabinetInfoService.updateCabinetStatus(lent.cabinet_id, CabinetStatusType.BANNED);
                    await this.lentService.returnLentCabinet(lent.user_id);
                }
                this.emailsender.mailing(lent.intra_id, days);
            }
        })
    }
}