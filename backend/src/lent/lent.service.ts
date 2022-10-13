import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import Lent from 'src/entities/lent.entity';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { ILentRepository } from './repository/lent.repository.interface';
import { BanService } from '../ban/ban.service';
import { LentTools } from './lent.component';
import {
  Transactional,
  Propagation,
  runOnTransactionComplete,
} from 'typeorm-transactional';

@Injectable()
export class LentService {
  private logger = new Logger(LentService.name);
  constructor(
    @Inject('ILentRepository')
    private lentRepository: ILentRepository,
    private cabinetInfoService: CabinetInfoService,
    private banService: BanService,
    @Inject(forwardRef(() => LentTools))
    private lentTools: LentTools,
  ) {}

  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async lentCabinet(cabinet_id: number, user: UserSessionDto): Promise<void> {
    try {
      this.logger.debug(`Called ${LentService.name} ${this.lentCabinet.name}`);
      // 1. 해당 유저가 대여중인 사물함이 있는지 확인
      const is_lent: boolean = await this.lentRepository.getIsLent(
        user.user_id,
      );
      if (is_lent) {
        throw new HttpException(
          `🚨 이미 대여중인 사물함이 있습니다 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. 고장이나 ban 사물함인지 확인
      const cabinet: CabinetInfoResponseDto =
        await this.cabinetInfoService.getCabinetResponseInfo(cabinet_id);
      if (
        cabinet.status === CabinetStatusType.BROKEN ||
        cabinet.status === CabinetStatusType.BANNED
      ) {
        const message =
          cabinet.status === CabinetStatusType.BROKEN
            ? '🚨 해당 사물함은 고장난 사물함입니다 🚨'
            : '🚨 해당 사물함은 비활성화된 사물함입니다 🚨';
        throw new HttpException(message, HttpStatus.FORBIDDEN);
      }

      // 3. 잔여 자리가 있는지 확인
      if (cabinet.status === CabinetStatusType.SET_EXPIRE_FULL) {
        throw new HttpException(
          `🚨 해당 사물함에 잔여 자리가 없습니다 🚨`,
          HttpStatus.CONFLICT,
        );
      }

      // 4. 동아리 사물함인지 확인
      if (cabinet.lent_type === LentType.CIRCLE) {
        throw new HttpException(
          `🚨 해당 사물함은 동아리 전용 사물함입니다 🚨`,
          HttpStatus.I_AM_A_TEAPOT,
        );
      }
      // 4. 현재 대여 상태에 따라 케이스 처리
      await this.lentTools.lentStateTransition(user, cabinet);
    } catch (err) {
      runOnTransactionComplete((err) => err && this.logger.error(err));
      throw err;
    }
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async updateLentCabinetTitle(
    cabinet_title: string,
    user: UserSessionDto,
  ): Promise<void> {
    this.logger.debug(
      `Called ${LentService.name} ${this.updateLentCabinetTitle.name}`,
    );
    // 1. 해당 유저가 대여중인 사물함 id를 가져옴.
    const my_cabinet_id: number = await this.lentRepository.getLentCabinetId(
      user.user_id,
    );
    if (my_cabinet_id === null) {
      throw new HttpException(
        `${user.intra_id} doesn't lent cabinet!`,
        HttpStatus.FORBIDDEN,
      );
    }
    // 2. 해당 캐비넷 제목 업데이트
    await this.lentRepository.updateLentCabinetTitle(
      cabinet_title,
      my_cabinet_id,
    );
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async updateLentCabinetMemo(
    cabinet_memo: string,
    user: UserSessionDto,
  ): Promise<void> {
    this.logger.debug(
      `Called ${LentService.name} ${this.updateLentCabinetMemo.name}`,
    );
    // 1. 해당 유저가 대여중인 사물함 id를 가져옴.
    const my_cabinet_id: number = await this.lentRepository.getLentCabinetId(
      user.user_id,
    );
    if (my_cabinet_id === null) {
      throw new HttpException(
        `${user.intra_id} doesn't lent cabinet!`,
        HttpStatus.FORBIDDEN,
      );
    }
    // 2. 해당 캐비넷 메모 업데이트
    await this.lentRepository.updateLentCabinetMemo(
      cabinet_memo,
      my_cabinet_id,
    );
    runOnTransactionComplete((err) => err && this.logger.error(err));
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
  })
  async returnCabinet(user: UserSessionDto): Promise<void> {
    this.logger.debug(`Called ${LentService.name} ${this.returnCabinet.name}`);
    try {
      // 1. 해당 유저가 대여중인 lent 정보를 가져옴.
      const lent: Lent = await this.lentRepository.getLent(user.user_id);
      if (lent === null) {
        throw new HttpException(
          `${user.intra_id} doesn't lent cabinet!`,
          HttpStatus.FORBIDDEN,
        );
      }
      // 2. 블랙홀에 빠진 유저의 반납 처리인 경우
      // 개인 사물함을 사용하고 있었다면 강제 반납 처리 -> BANNED로 변경.
      if (user.user_id < -1) {
        if (lent.cabinet.lent_type === LentType.PRIVATE) {
          await this.cabinetInfoService.updateCabinetStatus(
            lent.cabinet.cabinet_id,
            CabinetStatusType.BANNED,
          );
          lent.cabinet.status = CabinetStatusType.BANNED;
        }
      }
      // 3. 현재 대여 상태에 따라 케이스 처리
      await this.lentTools.returnStateTransition(lent, user);
      // 4. Lent Table에서 값 제거.
      await this.lentRepository.deleteLentByLentId(lent.lent_id);
      // 5. Lent Log Table에서 값 추가.
      await this.lentRepository.addLentLog(lent);
      // 6. 공유 사물함은 72시간 내에 중도 이탈한 경우 해당 사용자에게 72시간 밴을 부여.
      if (lent.cabinet.lent_type === LentType.SHARE && !(user.user_id < -1)) {
        await this.banService.blockingDropOffUser(lent);
      }
    } catch (err) {
      runOnTransactionComplete((err) => err && this.logger.error(err));
      throw err;
    }
  }
}
