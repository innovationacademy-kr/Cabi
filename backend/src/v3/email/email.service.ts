import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
    private logger = new Logger(MailService.name);
    private mailTest: boolean;
    constructor (
        @Inject(ConfigService) private configService: ConfigService,
    ) {
        this.mailTest = configService.get<boolean>('email.test');
    }
}