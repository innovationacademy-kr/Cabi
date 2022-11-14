import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSender {
  private logger = new Logger(EmailSender.name);
  private mail_send: boolean;
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.mail_send = configService.get<boolean>('debug.mail_send');
  }

  public sendEmail(intra_id: string, subject: string, file: string): void {
    const emailFrom = this.configService.get<string>('email.from');
    this.mailerService
      .sendMail({
        from: `42CABI <${emailFrom}>`,
        to: intra_id + '@student.42seoul.kr',
        subject,
        template: `./${file}`,
        context: { intra_id },
      })
      .then((success) => {
        this.logger.log(`Send mail to ${intra_id} success!`);
        this.logger.log(`${intra_id} : ${new Date()} : ${success.response}`);
      })
      .catch((e) => {
        this.logger.error(`Send mail to ${intra_id} failed.. 🥺 ${e}`);
        this.logger.error(`${intra_id} : ${new Date()} : ${e}`);
      });
  }

  public mailing(intra_id: string, days: number) {
    let subject = '42CABI 사물함 연체 알림';
    let file;
    if (days === this.configService.get<number>('expire_term.soonoverdue')) {
      subject = '42CABI 사물함 대여 기간 만료 예정 안내';
      file = 'soonoverdue.hbs';
    } else if (days === this.configService.get<number>('expire_term.overdue')) {
      file = 'overdue.hbs';
    } else if (
      days === this.configService.get<number>('expire_term.lastoverdue')
    ) {
      file = 'lastoverdue.hbs';
    } else if (
      days === this.configService.get<number>('expire_term.forcedreturn')
    ) {
      subject = '42CABI 강제 반납 안내';
      file = 'forcedreturn.hbs';
    } else {
      return;
    }
    //배포 시에만 메일 발송 환경변수 확인
    if (this.mail_send === true) {
      this.sendEmail(intra_id, subject, file);
    } else {
      this.logger.debug(`[TESTING] [${subject}], sentTo: ${intra_id}`);
    }
  }
}
