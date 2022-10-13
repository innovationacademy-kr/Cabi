import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { LentDto } from 'src/dto/lent.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
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
} from 'typeorm-transactional';

@Injectable()
export class LentTools {
  private logger = new Logger(LentTools.name);
  constructor(
    @Inject('ILentRepository')
    private lentRepository: ILentRepository,
    private cabinetInfoService: CabinetInfoService,
    @Inject(forwardRef(() => LentService))
    private lentService: LentService,
    private banService: BanService,
  ) {}

  /**
   * 처음으로 풀방이 되면 해당 사물함 이용자들의 만료시간을 설정해주는 함수.
   * @param lent_list
   * @param lent_type
   */
  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async setExpireTimeAll(
    lent_list: LentDto[],
    lent_type: LentType,
  ): Promise<void> {
    this.logger.debug(`Called ${LentTools.name} ${this.setExpireTimeAll.name}`);
    const expire_time = new Date();
    const last_lent_time = lent_list[lent_list.length - 1].lent_time;
    if (lent_type === LentType.PRIVATE) {
      expire_time.setDate(last_lent_time.getDate() + 30);
    } else {
      expire_time.setDate(last_lent_time.getDate() + 45);
    }
    for await (const lent of lent_list) {
      this.lentRepository.setExpireTime(lent.lent_id, expire_time);
    }
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async lentStateTransition(
    user: UserSessionDto,
    cabinet: CabinetInfoResponseDto,
  ): Promise<void> {
    this.logger.debug(
      `Called ${LentTools.name} ${this.lentStateTransition.name}`,
    );

    const lent_user_cnt: number = await this.lentRepository.getLentUserCnt(
      cabinet.cabinet_id,
    );
    switch (cabinet.status) {
      case CabinetStatusType.AVAILABLE:
        const new_lent = await this.lentRepository.lentCabinet(
          user,
          cabinet.cabinet_id,
        );
        cabinet.lent_info.push(new_lent);
        if (lent_user_cnt + 1 === cabinet.max_user) {
          // 해당 대여로 처음으로 풀방이 되면 만료시간 설정
          await this.setExpireTimeAll(cabinet.lent_info, cabinet.lent_type);
          // 상태를 SET_EXPIRE_FULL로 변경
          await this.cabinetInfoService.updateCabinetStatus(
            cabinet.cabinet_id,
            CabinetStatusType.SET_EXPIRE_FULL,
          );
        }
        break;
      case CabinetStatusType.SET_EXPIRE_AVAILABLE: {
        const new_lent = await this.lentRepository.lentCabinet(
          user,
          cabinet.cabinet_id,
        );
        // 기존 유저의 만료시간으로 만료시간 설정
        await this.lentRepository.setExpireTime(
          new_lent.lent_id,
          cabinet.lent_info[0].expire_time,
        );
        // 해당 대여로 풀방이 되면 상태 변경
        if (lent_user_cnt + 1 === cabinet.max_user) {
          await this.cabinetInfoService.updateCabinetStatus(
            cabinet.cabinet_id,
            CabinetStatusType.SET_EXPIRE_FULL,
          );
        }
        break;
      }
    }
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async returnStateTransition(lent: Lent, user: UserSessionDto): Promise<void> {
    this.logger.debug(
      `Called ${LentTools.name} ${this.returnStateTransition.name}`,
    );
    const lent_user_cnt: number = await this.lentRepository.getLentUserCnt(
      lent.cabinet.cabinet_id,
    );
    switch (lent.cabinet.status) {
      case CabinetStatusType.AVAILABLE:
        break;
      case CabinetStatusType.SET_EXPIRE_FULL:
        await this.cabinetInfoService.updateCabinetStatus(
          lent.cabinet.cabinet_id,
          CabinetStatusType.SET_EXPIRE_AVAILABLE,
        );
      case CabinetStatusType.SET_EXPIRE_AVAILABLE:
        if (lent_user_cnt - 1 === 0) {
          await this.cabinetInfoService.updateCabinetStatus(
            lent.cabinet.cabinet_id,
            CabinetStatusType.AVAILABLE,
          );
          await this.lentService.updateLentCabinetTitle('', user);
          await this.lentService.updateLentCabinetMemo('', user);
        }
        break;
      case CabinetStatusType.BANNED:
      case CabinetStatusType.EXPIRED:
        const overdue = await this.banService.calDateDiff(
          lent.expire_time,
          new Date(),
        );
        const cumulative = await this.banService.addOverdueDays(user.user_id);
        await this.banService.blockingUser(lent, overdue + cumulative, false);
        if (
          lent.cabinet.status === CabinetStatusType.EXPIRED &&
          lent_user_cnt - 1 === 0
        ) {
          await this.cabinetInfoService.updateCabinetStatus(
            lent.cabinet.cabinet_id,
            CabinetStatusType.AVAILABLE,
          );
        }
        break;
    }
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }

  async getAllLent(): Promise<Lent[]> {
    this.logger.debug(`Called ${LentTools.name} ${this.getAllLent.name}`);
    return await this.lentRepository.getAllLent();
  }
}
