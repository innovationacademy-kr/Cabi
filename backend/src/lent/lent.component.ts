import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import Lent from 'src/entities/lent.entity';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';
import { BanService } from '../ban/ban.service';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { LentService } from './lent.service';
import { ILentRepository } from './repository/lent.repository.interface';
import {
  Transactional,
  Propagation,
  runOnTransactionComplete,
  IsolationLevel,
} from 'typeorm-transactional';
import { UserDto } from 'src/dto/user.dto';
import LentExceptionType from 'src/enums/lent.exception.enum';
import { ConfigService } from '@nestjs/config';
import { DateCalculator } from 'src/utils/date.calculator.component';

@Injectable()
export class LentTools {
  private logger = new Logger(LentTools.name);
  constructor(
    @Inject('ILentRepository')
    private lentRepository: ILentRepository,
    private cabinetInfoService: CabinetInfoService,
    @Inject(forwardRef(() => LentService))
    private lentService: LentService,
    @Inject(forwardRef(() => DateCalculator))
    private dateCalculator: DateCalculator,
    private banService: BanService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  /**
   * 처음으로 풀방이 되면 해당 사물함 이용자들의 만료시간을 설정해주는 함수.
   * @param cabinet_id
   * @param last_lent_time
   * @param lent_type
   */
  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.REPEATABLE_READ,
  })
  async setExpireTimeAll(
    cabinet_id: number,
    last_lent_time: Date,
    lent_type: LentType,
  ): Promise<void> {
    this.logger.debug(`Called ${LentTools.name} ${this.setExpireTimeAll.name}`);
    const expire_time = new Date();
    if (lent_type === LentType.PRIVATE) {
      expire_time.setDate(
        last_lent_time.getDate() +
          this.configService.get<number>('lent_term.private'),
      );
    } else {
      expire_time.setDate(
        last_lent_time.getDate() +
          this.configService.get<number>('lent_term.share'),
      );
    }
    await this.lentRepository.setExpireTimeAll(cabinet_id, expire_time);
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.REPEATABLE_READ,
  })
  async lentStateTransition(
    user: UserDto,
    cabinet_id: number,
  ): Promise<LentExceptionType> {
    this.logger.debug(
      `Called ${LentTools.name} ${this.lentStateTransition.name}`,
    );

    // 대여하고 있는 유저들의 대여 정보를 포함하는 cabinet 정보를 가져옴.
    // 가져오는 정보 : 캐비넷 상태, 캐비넷 대여타입, 캐비넷을 빌린 사람들의 인원 수
    let excepction_type = LentExceptionType.LENT_SUCCESS;
    const cabinet = await this.lentRepository.getLentCabinetData(cabinet_id);
    switch (cabinet.status) {
      case CabinetStatusType.AVAILABLE:
      case CabinetStatusType.SET_EXPIRE_AVAILABLE:
        // 동아리 사물함인지 확인
        if (cabinet.lent_type === LentType.CLUB) {
          excepction_type = LentExceptionType.LENT_CLUB;
          break;
        }
        if (cabinet.lent_type === LentType.SHARE) {
          if (cabinet.status === CabinetStatusType.SET_EXPIRE_AVAILABLE) {
            // 만료시간이 PENALTY_DAY_SHARE + 2 이하로 남은 경우 excepction_type을 LENT_UNDER_PENALTY_DAY_SHARE로 설정.
            const now = new Date();
            const expire_time = cabinet.expire_time;
            const diff = await this.dateCalculator.calDateDiff(
              now,
              expire_time,
            );

            if (
              diff <=
              this.configService.get<number>('penalty_day_share') + 2
            ) {
              excepction_type = LentExceptionType.LENT_UNDER_PENALTY_DAY_SHARE;
              break;
            }
          }
        }
        // 대여 처리
        const new_lent = await this.lentRepository.lentCabinet(
          user,
          cabinet_id,
          cabinet.new_lent_id,
        );
        if (cabinet.lent_count + 1 === cabinet.max_user) {
          if (cabinet.status === CabinetStatusType.AVAILABLE) {
            // 해당 대여로 처음으로 풀방이 되면 만료시간 설정
            await this.setExpireTimeAll(
              cabinet_id,
              new_lent.lent_time,
              cabinet.lent_type,
            );
          } else {
            // 기존 유저의 만료시간으로 만료시간 설정
            await this.lentRepository.setExpireTime(
              new_lent.lent_id,
              cabinet.expire_time,
            );
          }
          // 상태를 SET_EXPIRE_FULL로 변경
          await this.cabinetInfoService.updateCabinetStatus(
            cabinet_id,
            CabinetStatusType.SET_EXPIRE_FULL,
          );
        }
        break;

      case CabinetStatusType.SET_EXPIRE_FULL:
        excepction_type = LentExceptionType.LENT_FULL;
        break;

      case CabinetStatusType.EXPIRED:
        excepction_type = LentExceptionType.LENT_EXPIRED;
        break;

      case CabinetStatusType.BROKEN:
        excepction_type = LentExceptionType.LENT_BROKEN;
        break;

      case CabinetStatusType.BANNED:
        excepction_type = LentExceptionType.LENT_BANNED;
        break;
    }
    runOnTransactionComplete((err) => err && this.logger.error(err));
    return excepction_type;
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.REPEATABLE_READ,
  })
  async clearCabinetInfo(cabinet_id: number): Promise<void> {
    this.logger.debug(`Called ${LentTools.name} ${this.clearCabinetInfo.name}`);
    await this.lentRepository.clearCabinetInfo(cabinet_id);
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.REPEATABLE_READ,
  })
  async returnStateTransition(
    cabinet_id: number,
    user: UserDto,
  ): Promise<[Lent, LentType]> {
    this.logger.debug(
      `Called ${LentTools.name} ${this.returnStateTransition.name}`,
    );
    // 대여하고 있는 유저들의 대여 정보를 포함하는 cabinet 정보를 가져옴.
    // 가져오는 정보 : 캐비넷 상태, 캐비넷 대여타입, 캐비넷을 빌린 사람들의 인원 수
    const cabinet = await this.lentRepository.getReturnCabinetData(cabinet_id);
    const lent = cabinet.lents.filter(
      (lent) => lent.lent_user_id === user.user_id,
    )[0];
    const lent_count = cabinet.lents.length;
    // 2. cabinet_status에 따라 처리.
    switch (cabinet.status) {
      case CabinetStatusType.AVAILABLE:
        if (lent_count - 1 === 0) {
          await this.clearCabinetInfo(cabinet_id);
        }
        break;
      case CabinetStatusType.SET_EXPIRE_FULL:
        await this.cabinetInfoService.updateCabinetStatus(
          cabinet_id,
          CabinetStatusType.SET_EXPIRE_AVAILABLE,
        );
      case CabinetStatusType.SET_EXPIRE_AVAILABLE:
        if (lent_count - 1 === 0) {
          await this.cabinetInfoService.updateCabinetStatus(
            cabinet_id,
            CabinetStatusType.AVAILABLE,
          );
          await this.clearCabinetInfo(cabinet_id);
        }
        break;
      case CabinetStatusType.BANNED:
      case CabinetStatusType.EXPIRED:
        const overdue = await this.dateCalculator.calDateDiff(
          lent.expire_time,
          new Date(),
        );
        const cumulative = await this.banService.addOverdueDays(user.user_id);
        await this.banService.blockingUser(lent, overdue + cumulative, false);
        if (
          cabinet.status === CabinetStatusType.EXPIRED &&
          lent_count - 1 === 0
        ) {
          await this.cabinetInfoService.updateCabinetStatus(
            cabinet_id,
            CabinetStatusType.AVAILABLE,
          );
        }
        break;
    }
    // 3. Lent Table에서 값 제거.
    await this.lentRepository.deleteLentByLentId(lent.lent_id);
    runOnTransactionComplete((err) => err && this.logger.error(err));
    return [lent, cabinet.lent_type];
  }

  async getAllLent(): Promise<Lent[]> {
    this.logger.debug(`Called ${LentTools.name} ${this.getAllLent.name}`);
    return await this.lentRepository.getAllLent();
  }

  async getExpiredLent(): Promise<Lent[]> {
    this.logger.debug(`Called ${LentTools.name} ${this.getExpiredLent.name}`);
    const baseDate = new Date();
    const soonOverDue =
      this.configService.get<number>('expire_term.soonoverdue') - 1;
    baseDate.setDate(baseDate.getDate() + Math.abs(soonOverDue)); // soonOverDue일 이후 만료된 것들을 가져오기 위해 기준 날짜 설정.
    return await this.lentRepository.getExpiredLent(baseDate);
  }

  async getLentCabinetId(user_id: number): Promise<number> {
    return await this.lentRepository.getLentCabinetId(user_id);
  }
}
