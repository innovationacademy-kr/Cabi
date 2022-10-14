import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { LentService } from 'src/lent/lent.service';
import UserStateType from 'src/enums/user.state.type.enum';
import { BlackholeTools } from './blackhole.component';
import {
  Propagation,
  runOnTransactionComplete,
  Transactional,
} from 'typeorm-transactional';

@Injectable()
export class BlackholeService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    this.blackholeTimerTrigger();
  }

  private client_id: string;
  private client_secret: string;
  private token: string;
  private postConfig: AxiosRequestConfig;
  private logger: Logger;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(forwardRef(() => BlackholeTools))
    private blackholeTools: BlackholeTools,
    private userService: UserService,
    private lentService: LentService,
    private schedulerRegistry: SchedulerRegistry,
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
   * Intra에 Post 요청을 보내 API 사용을 위한 Oauth token을 발급한다.
   * @return void
   */
  async postOauthToken(): Promise<void> {
    this.logger.debug(
      `Called ${BlackholeService.name} ${this.postOauthToken.name}`,
    );
    const url = 'https://api.intra.42.fr/oauth/token';
    await firstValueFrom(
      this.httpService
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

  /**
   * 블랙홀에 빠진 유저의 정보를 업데이트한다.
   *
   * @Param intra_id: UserDto
   * @return void
   */
  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async updateBlackholedUser(user: UserDto): Promise<void> {
    this.logger.debug(
      `Called ${BlackholeService.name} ${this.updateBlackholedUser.name}`,
    );

    const min_user_id = await this.userService.getMinUserId();
    let new_user_id = -2;
    if (min_user_id < -1) {
      new_user_id = min_user_id - 1;
    }
    const new_intra_id = '[BLACKHOLED]' + user.intra_id;
    const new_user: UserDto = {
      user_id: new_user_id,
      intra_id: new_intra_id,
    };
    await this.userService.updateUserInfo(
      user.user_id,
      new_user,
      UserStateType.BLACKHOLED,
    );

    const myLent = await this.userService.checkUserBorrowed(new_user);
    if (myLent.cabinet_id !== -1) {
      this.logger.warn(`Return ${user.intra_id}'s cabinet`);
      await this.lentService.returnCabinet(new_user);
    }
    runOnTransactionComplete((err) => err && this.logger.error(err));
    this.blackholeTools.addBlackholedUserTimer(new_user);
  }

  async validateBlackholedUser(user: UserDto, data: any): Promise<void> {
    // 스태프는 판별하지 않음.
    if (data['staff?'] === true) {
      this.logger.warn(`${user.intra_id} is staff`);
      return;
    }
    let LearnerBlackhole: string | Date;
    if (data.blackholed_at) {
      LearnerBlackhole = data.blackholed_at;
    } else {
      LearnerBlackhole = data.cursus_users[1].blackholed_at;
    }
    const today = new Date();
    // Member는 판별하지 않음.
    if (!LearnerBlackhole) {
      this.logger.log(
        `${user.intra_id} is Member, doesn't have blackhole date`,
      );
      return;
    }
    const blackhole_date = new Date(LearnerBlackhole);
    this.logger.log(`Blackhole_day: ${blackhole_date}`);
    this.logger.log(`Today: ${today}`);
    const time_diff = blackhole_date.getTime() - today.getTime();
    // 블랙홀에 빠지지 않았으면 Timer를 다시 등록.
    // 블랙홀에 빠졌다면 해당 유저 정보를 업데이트.
    if (time_diff >= 0) {
      this.logger.log(`${user.intra_id} not yet fall into a blackhole`);
      await this.blackholeTools.addBlackholeTimer(user, blackhole_date);
      return;
    } else {
      this.logger.log(`${user.intra_id} already fell into a blackhole`);
      await this.updateBlackholedUser(user);
    }
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
  async requestValidateBlackholedUser(user: UserDto): Promise<void> {
    this.logger.debug(
      `Called ${BlackholeService.name} ${this.validateBlackholedUser.name}`,
    );
    const url = `https://api.intra.42.fr/v2/users/${user.intra_id}`;
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
    this.logger.debug(`Request url: ${url}`);
    await firstValueFrom(
      this.httpService
        .get(url, { headers: headersRequest })
        .pipe(map((res) => res.data)),
    )
      .then(async (data) => {
        this.logger.log(`id: ${user.user_id}, intra_id: ${user.intra_id}`);
        await this.validateBlackholedUser(user, data);
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * 서버가 처음 구동되면 모든 유저에 대해 블랙홀에 빠졌는지 확인 작업을 수행.
   */
  async blackholeTimerTrigger() {
    this.logger.debug(
      `Called ${BlackholeService.name} ${this.blackholeTimerTrigger.name}`,
    );
    const users: UserDto[] = await this.userService.getAllUser();
    await this.postOauthToken().catch((err) => {
      this.logger.error(err);
    });

    for (const user of users) {
      if (user.user_id > 0) {
        await this.requestValidateBlackholedUser(user).catch(async (err) => {
          if (err.status === HttpStatus.NOT_FOUND) {
            this.logger.error(
              `${user.intra_id} is already expired or not exists in 42 intra`,
            );
            await this.updateBlackholedUser(user);
          } else {
            this.logger.error(err);
          }
        });
      } else {
        this.blackholeTools.addBlackholedUserTimer(user);
      }
    }
    this.logger.debug(
      `Current Timer list: \n ${this.schedulerRegistry.getTimeouts()}`,
    );
  }
}
