import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IBlackholeRepository } from './repository/blackhole.repository';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BlackholeService {
  private client_id: string;
  private client_secret: string;
  private token: string;
  private postConfig: AxiosRequestConfig;
  private logger: Logger;

  constructor(
    private blackholeRepository: IBlackholeRepository,
    private readonly httpService: HttpService,
    @Inject(ConfigService) private configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.logger = new Logger(BlackholeService.name);
    this.client_id = this.configService.get<string>('ftAuth.clientid');
    this.client_secret = this.configService.get<string>('ftAuth.secret');
    this.token = null;
    this.postConfig = {
      params: {
        grant_type: 'client_credentials',
        client_id: `${this.client_id}`,
        client_secret: `${this.client_secret}`,
      },
    };
  }

  async deleteBlackholedUser(intra_id: string) {
    try {
      this.logger.warn(`delete ${intra_id}`);
      this.blackholeRepository.deleteBlackholedUser(intra_id);
    } catch (err) {
      this.logger.error(err);
    }
  }

  // flag가 1일 때만 토큰 발급 후 validateBlackholedUsers 호출.
  async postOauthToken(flag: number) {
    const url = 'https://api.intra.42.fr/oauth/token';
    await firstValueFrom(
      await this.httpService
        .post(url, null, this.postConfig)
        .pipe(map((res) => res.data)),
    )
    .then((data) => {
      this.token = data.access_token;
      this.logger.log(`Issued new token ${this.token}`);
      if (flag === 1)
        this.validateBlackholedUsers();
    })
    .catch((err) => {
      throw new HttpException('postOauthToken', err.response.status);
    });
  }

  async validateBlackholedUser(intra_id: string, token: string): Promise<void> {
    const url = `https://api.intra.42.fr/v2/users/${intra_id}`;
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    this.logger.debug(`Request url: ${url}`);
    await firstValueFrom(
      await this.httpService
        .get(url, { headers: headersRequest })
        .pipe(map((res) => res.data)),
      )
      .then((data) => {
        // 존재하는 유저인지 먼저 필터링
        // cursus_users 0 => Piscine
        // cursus_users 1 => Learner
        // blackholed_at이 null이면 Member로 판단.
        // blackholed_at이 Now()보다 작으면 블랙홀에 빠진것으로 판단.
        // cursus_users 2 => Member

        // get Learner info blackholed_at
        this.logger.log(`id: ${data.id}, intra_id: ${intra_id}`);
        const LearnerBlackhole: string = data.cursus_users[1].blackholed_at;
        const today = new Date();
        // blackholed_at이 null이 아닌 경우
        if (LearnerBlackhole) {
          this.logger.log(`Blackhole_day: ${new Date(LearnerBlackhole)}`);
          this.logger.log(`Today: ${today}`);
          if (new Date(LearnerBlackhole) >= today) {
            this.logger.log(`${intra_id} not yet fall into a blackhole`);
          } else {
            this.logger.log(`${intra_id} already fell into a blackhole`);
            this.deleteBlackholedUser(intra_id);
          }
        } else {
          this.logger.log(`${intra_id} is Member, doesn't have blackhole date`);
        }
      })
      .catch((err) => {
        throw new HttpException('validateBlackholedUser', err.response.status);
      })
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async validateBlackholedUsers(): Promise<void> {
    const users: string[] = await this.authService.getAllUser();

    await this.postOauthToken(0)
    .catch((err) => {
      this.logger.error(err);
    });

    // intra API 요청 시간 제한이 있어 비동기로 처리 불가.
    for (const intra_id of users) {
      await this.validateBlackholedUser(intra_id, this.token)
      .catch((err) => {
        if (err.status === 401 || err.status === 429) { // 토큰을 재발급해야하는 경우
          this.logger.warn('Token is expired or not valid. Reissuing token...');
          this.postOauthToken(1);
        } else if (err.status === 404) { // intra 계정이 만료되어 42에서는 삭제됐지만 cabi db에는 존재, 삭제를 해야하는 경우
          this.logger.warn(`${intra_id} is already expired in 42 intra`);
          this.deleteBlackholedUser(intra_id);
        } else {
          throw new HttpException( // 기타 오류
            'validateBlackholedUsers',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    }
  }
}
