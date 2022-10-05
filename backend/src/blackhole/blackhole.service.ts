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
import { CabinetInfoService } from 'src/v3/cabinet/cabinet.info.service';
import { UserDto } from 'src/dto/user.dto';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { UserService } from 'src/v3/user/user.service';
import { LentService } from 'src/v3/lent/lent.service';

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
    private readonly cabinetService: CabinetInfoService,
    private readonly userService: UserService,
    private readonly lentService: LentService,
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
   * @Param intra_id: UserDto
   * @return void
   */
  // TODO: 기존에 있던 모듈 삭제로 인해 사용함수 변경이 있었습니다. 한 번 확인해주세요!
  async updateBlackholedUser(user: UserDto): Promise<void> {
    try {
      const myLent = await this.userService.checkUserBorrowed(user);
      if (myLent.cabinet_id !== -1) {
        this.logger.warn(`Return ${user.intra_id}'s cabinet`);
        await this.lentService.returnLentCabinet(user);
        await this.cabinetService.updateCabinetStatus(myLent.cabinet_id, CabinetStatusType.BANNED);
      }
      // FIXME:
      // 인트라에서 유저의 계정이 만료되면 해당 유저가 가지고 있던 user_id와 intra_id가 다른 유저에게 재할당될 수 있습니다.
      // 따라서 블랙홀에 빠진 유저의 user_id는 음수로, Intra_id 앞에는 blackholed 라는 텍스트를 붙혀 유저 정보를 업데이트 하는 방식으로
      // 무결성이 발생할 수 있는 문제를 해결하도록 수정하겠습니다.
      // this.logger.warn(`Delete User ${user.intra_id}`);
      // this.blackholeRepository.deleteBlackholedUser(user.user_id);
      this.blackholeRepository.updateBlackholedUser(
        user.user_id,
        user.intra_id,
      );
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
        if (flag === 1) this.validateBlackholedUsers();
      })
      .catch((err) => {
        throw new HttpException('postOauthToken', err.response.status);
      });
  }

  /**
   * 블랙홀에 빠진 유저인지 아닌지를 검증한다.
   * staff? 값이 true이면 Staff이므로 삭제하지 않는다.
   * cursus_users 0 => Piscine
   * cursus_users 1 => Learner
   * cursus_users 2 => Member
   * cursus_users 1 의 값을 갖고 있지 않으면 카뎃도 스태프도 아닌 비인가 사용자(ex 피시너)이므로 강제 반납 및 삭제 처리한다.
   * blackholed_at이 null이면 Member로 판단한다.
   * blackholed_at이 Now()보다 작으면 블랙홀에 빠진것으로 판단하여 deleteBlackholedUser를 호출한다.
   * @Param intra_id: UserDto
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
        if (data['staff?'] === true) {
          // 스태프는 삭제하지 않음.
          this.logger.warn(`${user.intra_id} is staff`);
          return;
        }
        if (!data.cursus_users[1]) {
          // 카뎃이 아닌 경우는 강제 반납 및 삭제 처리.
          this.logger.warn(`${user.intra_id} is not Cadet`);
          this.updateBlackholedUser(user);
          return;
        }
        const LearnerBlackhole: string = data.cursus_users[1].blackholed_at;
        const today = new Date();
        if (LearnerBlackhole) {
          this.logger.log(`Blackhole_day: ${new Date(LearnerBlackhole)}`);
          this.logger.log(`Today: ${today}`);
          if (new Date(LearnerBlackhole) >= today) {
            this.logger.log(`${user.intra_id} not yet fall into a blackhole`);
          } else {
            this.logger.log(`${user.intra_id} already fell into a blackhole`);
            this.updateBlackholedUser(user);
          }
        } else {
          this.logger.log(
            `${user.intra_id} is Member, doesn't have blackhole date`,
          );
        }
      })
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
  }

  /**
   * 매일 오전 02시에 DB에 존재하는 유저들에 대해 블랙홀에 빠졌는지를 판단한다.
   * @Param void
   * @return void
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async validateBlackholedUsers(): Promise<void> {
    const users: UserDto[] = await this.blackholeRepository.getAllUser();
    await this.postOauthToken(0).catch((err) => {
      this.logger.error(err);
    });

    // intra API 요청 시간 간격에 제한이 있어 비동기로 처리 불가하다.
    for (const user of users) {
      if (user.user_id > 0) {
        await this.validateBlackholedUser(user).catch((err) => {
          HttpStatus.TOO_MANY_REQUESTS;
          if (
            err.status === HttpStatus.UNAUTHORIZED ||
            err.status === HttpStatus.TOO_MANY_REQUESTS
          ) {
            // 토큰이 만료되었거나 유효하지 않아 새로 발급한다.
            this.logger.warn(
              'Token is expired or not valid. Reissuing token...',
            );
            // FIXME: 무한루프의 가능성이 있습니다.
            // this.postOauthToken(1);
          } else if (err.status === HttpStatus.NOT_FOUND) {
            // 계정이 만료되어 intra에서는 삭제됐지만 cabi db에는 존재하는 유저를 삭제한다.
            this.logger.warn(
              `${user.intra_id} is already expired or not exists in 42 intra`,
            );
            this.updateBlackholedUser(user);
          } else {
            console.log(err.status);
            throw new HttpException( // 기타 오류
              'validateBlackholedUsers',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        });
      }
    }
  }
}
