import {
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
import { IBlackholeRepository } from './repository/blackhole.repository';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';
import { UserDto } from 'src/dto/user.dto';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { UserService } from 'src/user/user.service';
import { LentService } from 'src/lent/lent.service';

@Injectable()
export class BlackholeService
  implements OnApplicationBootstrap {

  onApplicationBootstrap() {
    this.blackholeTimerTrigger();
  }

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
   * 블랙홀에 빠진 유저의 정보를 업데이트한다.
   *
   * @Param intra_id: UserDto
   * @return void
   */
  async updateBlackholedUser(user: UserDto): Promise<void> {
    try {
      const myLent = await this.userService.checkUserBorrowed(user);
      if (myLent.cabinet_id !== -1) {
        this.logger.warn(`Return ${user.intra_id}'s cabinet`);
        await this.lentService.returnCabinet(user);
        await this.cabinetService.updateCabinetStatus(
          myLent.cabinet_id,
          CabinetStatusType.BANNED,
        );
      }
      // FIXME: V3에 맞게 수정 필요.
      // await this.blackholeRepository.updateBlackholedUser(
      //   user.user_id,
      //   user.intra_id,
      // );
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Intra에 Post 요청을 보내 API 사용을 위한 Oauth token을 발급한다.
   * @return void
   */
  async postOauthToken(): Promise<void> {
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
      this.httpService
        .get(url, { headers: headersRequest })
        .pipe(map((res) => res.data)),
      )
      .then(async (data) => {
        this.logger.log(`id: ${user.user_id}, intra_id: ${user.intra_id}`);
        // 스태프는 판별하지 않음.
        if (data['staff?'] === true) {
          this.logger.warn(`${user.intra_id} is staff`);
          return;
        }
        // 카뎃이 아닌 경우는 강제 반납 및 삭제 처리.
        if (!data.cursus_users[1]) {
          this.logger.warn(`${user.intra_id} is not Cadet`);
          this.updateBlackholedUser(user);
          return;
        }
        const LearnerBlackhole: string = data.cursus_users[1].blackholed_at;
        const today = new Date();
        // Member는 판별하지 않음.
        if (!LearnerBlackhole) {
          this.logger.log(`${user.intra_id} is Member, doesn't have blackhole date`);
          return ;
        }
        const blackhole_date = new Date(LearnerBlackhole);
        this.logger.log(`Blackhole_day: ${blackhole_date}`);
        this.logger.log(`Today: ${today}`);
        const time_diff = blackhole_date.getTime() - today.getTime();
        // 블랙홀에 빠지지 않았으면 Timer를 다시 등록.
        // 블랙홀에 빠졌다면 해당 유저 정보를 업데이트.
        if (time_diff >= 0) {
          this.logger.log(`${user.intra_id} not yet fall into a blackhole`);
          await this.addBlackholeTimer(user, blackhole_date);
        } else {
          this.logger.log(`${user.intra_id} already fell into a blackhole`);
          await this.updateBlackholedUser(user);
        }
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }

  setTimeoutDate(intra_id: string, date: Date, callback) {
    const now = (new Date()).getTime();
    const then = date.getTime();
    const diff = Math.max((then - now), 0);
    let timeout: NodeJS.Timeout;
    try {
      this.schedulerRegistry.deleteTimeout(intra_id);
    } catch (err) {}
    if (diff > 0x7FFFFFFF) { // setTimeout limit is MAX_INT32=(2^31-1)
      timeout = setTimeout(() => {
        this.setTimeoutDate(intra_id, date, callback);
      }, 0x7FFFFFFF);
    } else {
      timeout = setTimeout(callback, diff);
    }
    this.schedulerRegistry.addTimeout(intra_id, timeout);
  }

  // Today - Blackhole_date후 fired될 Timer등록.
  // Timer가 fired 되면 콜백으로 validateBlackholedUser를 수행.
  async addBlackholeTimer(user: UserDto, blackhole_date: Date) {
    const callback = async () => {
      this.logger.debug(`Blackhole timer for ${user.intra_id} fired!`);
      await this.postOauthToken().catch((err) => {
        this.logger.error(err);
      });
      await this.validateBlackholedUser(user)
      .catch(async (err) => {
          if (err.status === HttpStatus.NOT_FOUND) {
            this.logger.error(
              `${user.intra_id} is already expired or not exists in 42 intra`,
            );
            await this.updateBlackholedUser(user);
          }
          else {
            this.logger.error(err);
          }
      });
    };
    this.setTimeoutDate(user.intra_id, blackhole_date, callback);
  }

  // 서버가 처음 구동되면 모든 유저에 대해 블랙홀에 빠졌는지 확인 작업을 수행.
  async blackholeTimerTrigger() {
    this.logger.debug(`Called ${BlackholeService.name} ${this.blackholeTimerTrigger.name}`);
    const users: UserDto[] = await this.blackholeRepository.getAllUser();
    await this.postOauthToken().catch((err) => {
      this.logger.error(err);
    });
    console.log(users);
    for (const user of users) {
      if (user.user_id > 0) {
        await this.validateBlackholedUser(user)
        .catch(async (err) => {
          if (err.status === HttpStatus.NOT_FOUND) {
            this.logger.error(
              `${user.intra_id} is already expired or not exists in 42 intra`,
            );
            await this.updateBlackholedUser(user);
          }
          else {
            this.logger.error(err);
          }
        });
      }
    }
    this.logger.debug(`Current Timer list: \n ${this.schedulerRegistry.getTimeouts()}`);
  }
}
