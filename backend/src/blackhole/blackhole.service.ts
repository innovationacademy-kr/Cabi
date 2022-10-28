import {
  forwardRef,
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
import { BlackholeTools } from './blackhole.component';
import {
  IsolationLevel,
  Propagation,
  runOnTransactionComplete,
  Transactional,
} from 'typeorm-transactional';
import LentType from 'src/enums/lent.type.enum';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { UserSessionDto } from 'src/dto/user.session.dto';

@Injectable()
export class BlackholeService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    const is_local = this.configService.get<boolean>('is_local');
    if (is_local === false) {
      this.blackholeTimerTrigger();
    }
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
    private cabinetInfoService: CabinetInfoService,
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
        throw err;
      });
  }

  /**
   * 블랙홀에 빠진 유저의 정보를 삭제 처리한다.
   *
   * @Param intra_id: UserDto
   * @return void
   */
  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async deleteBlackholedUser(user: UserDto): Promise<void> {
    this.logger.debug(
      `Called ${BlackholeService.name} ${this.deleteBlackholedUser.name}`,
    );
    const cabinet = await this.userService.getCabinetDtoByUserId(user.user_id);
    if (cabinet) {
      this.logger.warn(`Return ${user.intra_id}'s cabinet`);
      if (cabinet.lent_type === LentType.PRIVATE) {
        await this.cabinetInfoService.updateCabinetStatus(
          cabinet.cabinet_id,
          CabinetStatusType.BANNED,
        );
      }
      await this.lentService.returnCabinet(user);
    }
    await this.userService.deleteUserById(user.user_id);
    runOnTransactionComplete((err) => err && this.logger.error(err));
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
   * @Param intra_id: UserDto, date: any
   * @return void
   */
  async validateBlackholedUser(user: UserDto, data: any): Promise<void> {
    const today = new Date();
    const fire_date = new Date();
    // 스태프는 판별하지 않음.
    let is_staff = false;
    if (data['staff?'] === true) {
      is_staff = true;
    } else if (data.groups.length !== 0) {
      for (const group of data.groups) {
        if (group.name === 'STAFF' || group.name === 'pedago') {
          is_staff = true;
        }
      }
    }
    if (is_staff) {
      this.logger.log(`${user.intra_id} is staff`);
      fire_date.setDate(today.getDate() + 90);
      await this.blackholeTools.addBlackholeTimer(user, fire_date);
      await this.userService.updateBlackholeDate(user.user_id, null);
      return;
    }
    const LearnerBlackhole = data.cursus_users[1].blackholed_at;
    // Member는 판별하지 않음.
    if (!LearnerBlackhole) {
      this.logger.log(
        `${user.intra_id} is Member, doesn't have blackhole date`,
      );
      fire_date.setDate(today.getDate() + 90);
      await this.blackholeTools.addBlackholeTimer(user, fire_date);
      await this.userService.updateBlackholeDate(user.user_id, null);
      return;
    }
    const blackhole_date = new Date(LearnerBlackhole);
    this.logger.log(`Blackhole_day: ${blackhole_date}`);
    this.logger.log(`Today: ${today}`);
    // 블랙홀에 빠지지 않았으면 Timer를 다시 등록, blackhole_date 필드 업데이트.
    // 블랙홀에 빠졌다면 해당 유저 강제 반납/삭제 처리.
    if (blackhole_date.getTime() - today.getTime() > 0) {
      this.logger.log(`${user.intra_id} not yet fall into a blackhole`);
      await this.blackholeTools.addBlackholeTimer(user, blackhole_date);
      await this.userService.updateBlackholeDate(user.user_id, blackhole_date);
    } else {
      this.logger.log(`${user.intra_id} already fell into a blackhole`);
      await this.deleteBlackholedUser(user);
    }
  }

  /**
   * 유저가 블랙홀에 빠졌는지 검증하기 위해 42 intra에 GET Request를 보낸다.
   * @param user
   */
  async requestValidateBlackholedUser(user: UserDto): Promise<void> {
    this.logger.debug(
      `Called ${BlackholeService.name} ${this.requestValidateBlackholedUser.name}`,
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
   * 서버가 처음 구동되면 DB에 저장된 다음 동작을 수행한다.
   * 1. 블랙홀 필드가 null인 사용자는 15일 뒤에 동작하는 타이머를 등록.
   * 2. 블랙홀 필드가 null이 아니고, 블랙홀 필드의 날짜 > 오늘 날짜라면 블랙홀 필드의 날짜를 기준으로 타이머를 등록.
   * 3. 그 외에 경우에는 intra에 새 블랙홀 날짜를 받아와 다시 검증.
   */
  async blackholeTimerTrigger() {
    this.logger.debug(
      `Called ${BlackholeService.name} ${this.blackholeTimerTrigger.name}`,
    );
    const users: UserSessionDto[] = await this.userService.getAllUser();

    for (const user of users) {
      try {
        if (user.blackholed_at === null) {
          const fire_date = new Date();
          fire_date.setDate(fire_date.getDate() + 15);
          this.blackholeTools.addBlackholeTimer(user, fire_date);
        } else if (user.blackholed_at.getTime() - new Date().getTime() > 0) {
          this.blackholeTools.addBlackholeTimer(user, user.blackholed_at);
        } else {
          await this.postOauthToken();
          await this.requestValidateBlackholedUser(user);
        }
      } catch (err) {
        if (err.status === HttpStatus.NOT_FOUND) {
          this.logger.error(
            `${user.intra_id} is already expired or not exists in 42 intra`,
          );
          await this.deleteBlackholedUser(user);
        } else {
          this.logger.error(err);
        }
      }
    }
    this.logger.debug(
      `Current Timer list: \n ${this.schedulerRegistry.getTimeouts()}`,
    );
  }
}
