import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class MailService {
    private logger = new Logger('EmailService');
    constructor(
        private readonly mailerService: MailerService,
    ) {}

    public sendMail(
        intra_id: string,
        subject: string,
        file: string): void {
        this.mailerService.sendMail({
            from: `"42CABI" <${process.env.MAIL_FROM}>`,
            to: intra_id + '@student.42seoul.kr',
            subject: subject,
            template: `./${file}`,
            context: { intra_id }
        })
        .then((success) => {
            console.log(success);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    public mailing(info: overUserInfo[], num: number) {
        let subject = '42CABI 사물함 연체 알림';
        let file = 'overdue.ejs';
        if (num === 0) {
            file = 'soonoverdue.ejs';
        } else if (num === 7) {
            file = 'overdue.ejs';
        } else if (num === 14) {
            file = 'lastoverdue.ejs';
        } else if (num === 15) {
            subject = '42CABI 영구사용정지 안내';
            file = 'ban.ejs';
        }
        info.forEach(user => this.sendMail(user.intra_id, subject, file));
    }

    @Cron(CronExpression.EVERY_DAY_AT_9PM)
    public scheduling() {
        this.logger.log('연체된 사용자들에게 메일을 보내는 중...');
        const dayList = [0, 7, 14];
        dayList.forEach(day => {
            getOverUser(day).then(res => {
                if (res) {
                    this.mailing(res, day);
                }
            }).catch(e => console.error(e));
        })
    }
}
