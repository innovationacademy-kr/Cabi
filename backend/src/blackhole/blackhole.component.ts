import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserDto } from 'src/dto/user.dto';
import { BlackholeService } from './blackhole.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UserSessionDto } from 'src/dto/user.session.dto';

@Injectable()
export class BlackholeTools {
  private logger = new Logger(BlackholeTools.name);
  constructor(
    @Inject(forwardRef(() => BlackholeService))
    private blackholeService: BlackholeService,
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
    this.logger.log(`new timer that fired on ${blackhole_date} set!`);
    const callback = async () => {
      this.logger.debug(`Blackhole timer for ${user.intra_id} fired!`);
      await this.blackholeService.postOauthToken().catch((err) => {
        this.logger.error(err);
      });
      await this.blackholeService
        .requestValidateBlackholedUser(user)
        .catch(async (err) => {
          if (err.status === HttpStatus.NOT_FOUND) {
            this.logger.error(
              `${user.intra_id} is already expired or not exists in 42 intra`,
            );
            await this.blackholeService.deleteBlackholedUser(user);
          } else {
            this.logger.error(err);
          }
        });
    };
    this.setTimeoutDate(user.intra_id, blackhole_date, callback);
  }

  @OnEvent('user.created')
  /**
   * 유저가 생성되면 해당 유저의 블랙홀 타이머를 등록.
   */
  async addBlackholeTimerNewUser(user: UserSessionDto) {
    if (user.staff === true || user.blackholed_at === null) {
      const fire_date = new Date();
      fire_date.setDate(fire_date.getDate() + 90);
      await this.addBlackholeTimer(user, fire_date);
    } else {
      await this.addBlackholeTimer(user, user.blackholed_at);
    }
  }
}
