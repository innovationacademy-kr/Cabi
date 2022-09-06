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
import { CabinetService } from 'src/cabinet/cabinet.service';
import { UserDto } from 'src/user/dto/user.dto';

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
    private readonly cabinetService: CabinetService,
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

  /**
   * 블랙홀에 빠진 유저를 DB에서 삭제한다.
   *
   * @Param intra_id: string
   * @return void
   */
  async deleteBlackholedUser(user: UserDto): Promise<void> {
    try {
    this.logger.warn(`Return ${user.intra_id}'s cabinet`);
      const myLent = await this.cabinetService.getUserLentInfo(user);
        if (myLent.lent_id !== -1) {
          const cabinet_id = await this.cabinetService.createLentLog(user);
          await this.cabinetService.updateActivationToBan(cabinet_id);
        }
        this.blackholeRepository.deleteBlackholedUser(user.user_id);
      } catch (err) {
        this.logger.error(err);
    }
  }

  /**
   * Intra에 Post 요청을 보내 API 사용을 위한 Oauth token을 발급한다.
   * flag가 1인 경우 validateBlackholedUsers를 호출한다.
   * @Param flag: number
   * @return void
   */
  async postOauthToken(flag: number): Promise<void> {
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

  /**
   * 블랙홀에 빠진 유저인지 아닌지를 검증한다.
   * cursus_users 0 => Piscine
   * cursus_users 1 => Learner
   * cursus_users 2 => Member
   * blackholed_at이 null이면 Member로 판단한다.
   * blackholed_at이 Now()보다 작으면 블랙홀에 빠진것으로 판단하여 deleteBlackholedUser를 호출한다.
   * @Param intra_id: string
   * @return void
   */
  async validateBlackholedUser(user: UserDto): Promise<void> {
    const url = `https://api.intra.42.fr/v2/users/${user.intra_id}`;
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
    this.logger.debug(`Request url: ${url}`);
    await firstValueFrom(
      await this.httpService
        .get(url, { headers: headersRequest })
        .pipe(map((res) => res.data)),
      )
      .then((data) => {
        this.logger.log(`id: ${user.user_id}, intra_id: ${user.intra_id}`);
        const LearnerBlackhole: string = data.cursus_users[1].blackholed_at;
        const today = new Date();
        if (LearnerBlackhole) {
          this.logger.log(`Blackhole_day: ${new Date(LearnerBlackhole)}`);
          this.logger.log(`Today: ${today}`);
          if (new Date(LearnerBlackhole) >= today) {
            this.logger.log(`${user.intra_id} not yet fall into a blackhole`);
          } else {
            this.logger.log(`${user.intra_id} already fell into a blackhole`);
            this.deleteBlackholedUser(user);
          }
        } else {
          this.logger.log(`${user.intra_id} is Member, doesn't have blackhole date`);
        }
      })
      .catch((err) => {
        throw new HttpException('validateBlackholedUser', err.response.status);
      })
  }

  /**
   * 매일 오전 02시에 DB에 존재하는 유저들에 대해 블랙홀에 빠졌는지를 판단한다.
   * @Param void
   * @return void
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async validateBlackholedUsers(): Promise<void> {
    const users: UserDto[] = await this.authService.getAllUser();

    await this.postOauthToken(0)
    .catch((err) => {
      this.logger.error(err);
    });

    // intra API 요청 시간 간격에 제한이 있어 비동기로 처리 불가하다.
    for (const user of users) {
      await this.validateBlackholedUser(user)
      .catch((err) => {
        if (err.status === 401 || err.status === 429) { // 토큰이 만료되었거나 유효하지 않아 새로 발급한다.
          this.logger.warn('Token is expired or not valid. Reissuing token...');
          this.postOauthToken(1);
        } else if (err.status === 404) { // 계정이 만료되어 intra에서는 삭제됐지만 cabi db에는 존재하는 유저를 삭제한다.
          this.logger.warn(`${user.intra_id} is already expired in 42 intra`);
          this.deleteBlackholedUser(user);
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
