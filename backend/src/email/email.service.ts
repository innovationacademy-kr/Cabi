import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
// import fs from 'fs';
import { BanService } from 'src/ban/ban.service';
import { overUserInfoDto } from 'src/ban/dto/overUserInfo.dto';
import { CabinetService } from 'src/cabinet/cabinet.service';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private mailTest: boolean;
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private readonly mailerService: MailerService,
    private banService: BanService,
    private cabinetService: CabinetService,
  ) {
    this.mailTest = configService.get<boolean>('email.test');
  }

  public sendMail(intra_id: string, subject: string, file: string): void {
    this.mailerService
      .sendMail({
        from: `"42CABI" <${this.configService.get<string>('email.from')}>`,
        to: intra_id + '@student.42seoul.kr',
        subject: subject,
        template: `./${file}`,
        context: { intra_id },
      })
      .then((success) => {
        this.logger.log(`Send mail to ${intra_id} success!`);
        // FIXME: 이메일 성공/실패 여부를 로깅하는 부분을 추후에 리팩토링하면 좋을거 같아요
        this.logger.log(`${intra_id} : ${new Date()} : ${success.response}`);
        // fs.appendFileSync(
        //   './email_logs/emailLog.txt',
        //   `${intra_id} : ${new Date()} : ${success.response}`,
        // );
      })
      .catch((err) => {
        this.logger.error(`Send mail to ${intra_id} failed.. 🥺 ${err}`);
        // FIXME: 이메일 성공/실패 여부를 로깅하는 부분을 추후에 리팩토링하면 좋을거 같아요
        this.logger.error(`${intra_id} : ${new Date()} : ${err}`);
        // fs.appendFileSync(
        //   './email_logs/emailLog.txt',
        //   `${intra_id} : ${new Date()} : ${err}`,
        // );
      });
  }

  public mailing(info: overUserInfoDto[], num: number) {
    let subject = '42CABI 사물함 연체 알림';
    let file = 'overdue.hbs';
    if (num === 0) {
      file = 'soonoverdue.hbs';
    } else if (num === 7) {
      file = 'overdue.hbs';
    } else if (num === 14) {
      file = 'lastoverdue.hbs';
    } else if (num === 15) {
      subject = '42CABI 영구사용정지 안내';
      file = 'ban.hbs';
    }
    // 배포 시에만 메일 발송 환경변수 확인
    if (this.mailTest === false) {
      info.forEach((user) => {
        this.sendMail(user.intra_id, subject, file);
      });
    } else {
      info.forEach((user) => {
        this.logger.debug(`[TESTING] [${subject}], sentTo: ${user.intra_id}`);
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  public scheduling() {
    this.logger.log('연체된 사용자들에게 메일을 보내는 중...');
    const dayList = [0, 7, 14];
    dayList.forEach((day) => {
      this.banService
        .getOverUser(day)
        .then((res) => {
          if (res) {
            this.mailing(res, day);
          }
        })
        .catch((e) => this.logger.error(e));
    });
    // 연체 후 14일이 경과하여 밴 메일을 보냄.
    this.banService
      .getOverUser(15)
      .then((res) => {
        if (res) {
          res.forEach(async (user) => {
            //user
            await this.banService.updateUserAuth(user.user_id);
            //cabinet
            await this.banService.updateCabinetActivation(user.cabinet_id, 2);
            //return
            await this.cabinetService.createLentLog(
              // TODO: v1의 queryModel.ts에 있는 내용이며 다른곳에서도 쓰임.
              user.user_id,
              user.intra_id,
            );
            //ban
            await this.banService.addBanUser({
              user_id: user.user_id,
              intra_id: user.intra_id,
              cabinet_id: user.cabinet_id,
            });
          });
          this.mailing(res, 15);
          this.cabinetService.getAllCabinets(); // TODO: v1의 dbModel.ts에 있는 내용이며 다른곳에서도 쓰임.
        }
      })
      .catch((e) => this.logger.error(e));
  }
}
