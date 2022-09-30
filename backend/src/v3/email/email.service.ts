import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
    private logger = new Logger(EmailService.name);
    private emailTest: boolean;
    constructor (
        @Inject(ConfigService) private configService: ConfigService,
        private readonly mailerService: MailerService,
    ) {
        this.emailTest = configService.get<boolean>('email.test');
    }

    public sendEmail(intra_id: string, subject: string, file: string): void {
        const emailFrom = this.configService.get<string>('email.from');
        this.mailerService.sendMail({
            from: `42CABI <${ emailFrom }>`,
            to: intra_id + '@student.42seoul.kr',
            subject,
            template: `./${file}`,
            context: { intra_id },
        }).then((success) => {
            this.logger.log(`Send mail to ${intra_id} success!`);
            this.logger.log(`${intra_id} : ${new Date()} : ${success.response}`);
        }).catch((e) => {
            this.logger.error(`Send mail to ${intra_id} failed.. 🥺 ${e}`);
            this.logger.error(`${intra_id} : ${new Date()} : ${e}`);
        });
    }

    

}