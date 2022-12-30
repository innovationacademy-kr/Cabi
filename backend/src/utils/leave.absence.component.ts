import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { UserDto } from 'src/dto/user.dto';
import Lent from 'src/entities/lent.entity';
import { LentService } from 'src/lent/lent.service';
import { DateCalculator } from './date.calculator.component';

@Injectable()
export class LeaveAbsence {
  private logger = new Logger(LeaveAbsence.name);
  private clientId: string;
  private clientSecret: string;
  private token: string;
  private postConfig: AxiosRequestConfig;

  constructor(
    private readonly httpService: HttpService,
    @Inject(LentService) private readonly lentService: LentService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(DateCalculator) private readonly dateCalculator: DateCalculator,
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

  //TODO: 연체자를 확인하는 로직이 중복되므로 다시 생각을 해봐야할 것 같습니다.
  async isExpired(lent: Lent): Promise<void> {
    const days = await this.dateCalculator.calDateDiff(
      lent.expire_time,
      new Date(),
    );
    if (days >= 0)
      await this.returnLeaveAbsenceStudent({
        user_id: lent.lent_user_id,
        intra_id: lent.user.intra_id,
      });
  }

  async returnLeaveAbsenceStudent(user: UserDto): Promise<void> {
    await this.postOauthToken().catch((err) => {
      this.logger.error(err);
    });
    const url = `https://api.intra.42.fr/v2/users/${user.intra_id}`;
    const headersRequest = {
      Authorization: `Bearer ${this.token}`,
    };
    try {
      const data = await firstValueFrom(
        this.httpService
          .get(url, { headers: headersRequest })
          .pipe(map((res) => res.data)),
      );
      if (data['active?'] === false) {
        this.logger.log(`User ${user.intra_id} is leave of absence`);
        await this.lentService.returnCabinet(user);
      }
    } catch (err) {
      throw new HttpException(err.response.data, err.response.status);
      // TODO: http status code가 404(Not found)면, 유저 정보를 지우는 로직 추가
      // TODO: http status code가 401(Unauthorized)면, token을 refresh하는 로직 추가
      // TODO: http status code가 429 (Too Many Requests)면, 해결 방법 어떻게 할까요?
    }
  }
}
