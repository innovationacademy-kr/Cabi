import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpiredChecker } from './expired.checker.component';
import { LeaveAbsence } from './leave.absence.component';
import { LentTools } from 'src/lent/lent.component';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class Scheduling {
  private readonly logger: Logger = new Logger(Scheduling.name);
  private token: string;
  private postConfig: AxiosRequestConfig;
  private clientId: string;
  private clientSecret: string;
  constructor(
    private readonly expiredChecker: ExpiredChecker,
    private readonly leaveAbsence: LeaveAbsence,
    private readonly lentTools: LentTools,
    @Inject(ConfigService) private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.clientId = this.configService.get<string>('ftAuth.clientid');
    this.clientSecret = this.configService.get<string>('ftAuth.secret');
    this.token = null;
    this.postConfig = {
      params: {
        grant_type: 'client_credentials',
        client_id: `${this.clientId}`,
        client_secret: `${this.clientSecret}`,
      },
    };
  }

  //FIXME: 이전 토큰 발급 방식이 너무 비효율적이기 때문에, 토큰 관련 모듈이 생성되기 전 임시로 작성한 코드입니다.
  //FIXME: 토큰 발급 모듈이 생성되면 새로 생성 된 메소드를 사용하도록 수정해야 합니다.
  async postOauthToken(): Promise<void> {
    const url = 'https://api.intra.42.fr/oauth/token';
    await firstValueFrom(
      await this.httpService
        .post(url, null, this.postConfig)
        .pipe(map((res) => res.data)),
    )
      .then((data) => {
        this.token = data.access_token;
        this.logger.log(`Issued new token ${this.token}`);
      })
      .catch((err) => {
        throw new HttpException('postOauthToken', err.response.status);
      });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkLents() {
    this.logger.debug(`Called ${ExpiredChecker.name} ${this.checkLents.name}`);
    const lentList = await Promise.all(await this.lentTools.getExpiredLent());

    //TODO: 해당 부분도 새로운 모듈이 생성되면 삭제해야합니다.
    await this.postOauthToken().catch((err) => {
      this.logger.error(err);
    });

    for await (const lent of lentList) {
      if (lent.expire_time === null) continue;
      await this.expiredChecker.checkExpiredCabinetEach(lent);
      await this.leaveAbsence.returnLeaveAbsenceStudent(
        {
          user_id: lent.lent_user_id,
          intra_id: lent.user.intra_id,
        },
        this.token,
      );
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
  }
}
