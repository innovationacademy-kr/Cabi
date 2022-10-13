import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { BlackholeService } from './blackhole.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BlackholeTools {
  private logger = new Logger(BlackholeTools.name);
  constructor(
    @Inject(forwardRef(() => BlackholeService))
    private blackholeService: BlackholeService,
    private userService: UserService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  setTimeoutDate(intra_id: string, date: Date, callback) {
    const now = new Date().getTime();
    const then = date.getTime();
    const diff = Math.max(then - now, 0);
    let timeout: NodeJS.Timeout;
    try {
      this.schedulerRegistry.deleteTimeout(intra_id);
    } catch (err) {}
    if (diff > 0x7fffffff) {
      // setTimeout limit is MAX_INT32=(2^31-1)
      timeout = setTimeout(() => {
        this.setTimeoutDate(intra_id, date, callback);
      }, 0x7fffffff);
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
      await this.blackholeService.postOauthToken().catch((err) => {
        this.logger.error(err);
      });
      await this.blackholeService
        .validateBlackholedUser(user)
        .catch(async (err) => {
          if (err.status === HttpStatus.NOT_FOUND) {
            this.logger.error(
              `${user.intra_id} is already expired or not exists in 42 intra`,
            );
            await this.blackholeService.updateBlackholedUser(user);
            await this.userService.deleteUser(user);
          } else {
            this.logger.error(err);
          }
        });
    };
    this.setTimeoutDate(user.intra_id, blackhole_date, callback);
  }

  /**
   * 블랙홀에 빠진 유저가 30일이 지나면 DB에서 삭제될 수 있도록 타이머를 설정합니다.
   * @param user
   */
  async addBlackholedUserTimer(user: UserDto) {
    const callback = async () => {
      this.logger.debug(`BlackholedUser timer for ${user.intra_id} fired!`);
      await this.userService.deleteUser(user);
    };
    const fired_date = new Date();
    fired_date.setDate(fired_date.getDate() + 30);
    this.setTimeoutDate(user.intra_id, fired_date, callback);
  }

  @OnEvent('user.created')
  /**
   * 유저가 생성되면 해당 유저의 블랙홀 타이머를 등록.
   */
  async validateBlackholeForNewUser(user: UserDto) {
    await this.validateBlackholeForNewUser(user).catch(async (err) => {
      if (err.status === HttpStatus.NOT_FOUND) {
        this.logger.error(
          `${user.intra_id} is already expired or not exists in 42 intra`,
        );
        await this.blackholeService.updateBlackholedUser(user);
      } else {
        this.logger.error(err);
      }
    });
    this.logger.debug(
      `New Timer: \n ${this.schedulerRegistry.getTimeout(user.intra_id)}`,
    );
  }
}
