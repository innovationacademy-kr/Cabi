import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import Lent from 'src/entities/lent.entity';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { ILentRepository } from './repository/lent.repository.interface';
import { BanService } from '../ban/ban.service';
import { LentTools } from './lent.component';

@Injectable()
export class LentService {
  private logger = new Logger(LentService.name);
  constructor(
    @Inject('ILentRepository')
    private lentRepository: ILentRepository,
    private cabinetInfoService: CabinetInfoService,
    private banService: BanService,
    private dataSource: DataSource,
    private lentTools: LentTools,
  ) {}

  async lentCabinet(cabinet_id: number, user: UserSessionDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
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
      await this.lentTools.lentStateTransition(user, cabinet, queryRunner);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

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
  }

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
  }

  async returnLentCabinet(user: UserSessionDto): Promise<void> {
    this.logger.debug(
      `Called ${LentService.name} ${this.returnLentCabinet.name}`,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. 해당 유저가 대여중인 lent 정보를 가져옴.
      const lent: Lent = await this.lentRepository.getLent(user.user_id);
      if (lent === null) {
        throw new HttpException(
          `${user.intra_id} doesn't lent cabinet!`,
          HttpStatus.FORBIDDEN,
        );
      }
      // 2. Lent Table에서 값 제거.
      await this.lentRepository.deleteLentByLentId(lent.lent_id);
      // 3. Lent Log Table에서 값 추가.
      await this.lentRepository.addLentLog(lent);
      // 4. 현재 대여 상태에 따라 케이스 처리
      await this.lentTools.returnStateTransition(lent.cabinet);
      // 5. 공유 사물함은 72시간 내에 중도 이탈한 경우 해당 사용자에게 72시간 밴을 부여.
      if (lent.cabinet.lent_type === LentType.SHARE) {
        await this.banService.blockingDropOffUser(lent);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
