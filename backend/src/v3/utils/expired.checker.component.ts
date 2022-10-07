import { Injectable, Logger } from "@nestjs/common";
import { CabinetInfoService } from "../cabinet/cabinet.info.service";
import { LentService } from "../lent/lent.service";

@Injectable()
export class ExpiredChecker {
    private logger = new Logger(ExpiredChecker.name);
    constructor (
        private readonly lentService: LentService,
        private cabinetInfoService: CabinetInfoService,
    ) {}

    async getExpiredDays(expire_time: Date): Promise<number> {
        this.logger.debug(`Called ${ExpiredChecker.name} ${this.getExpiredDays.name}`);
        const today = new Date();
        return (expire_time.getDate() - today.getDate());
    }
}