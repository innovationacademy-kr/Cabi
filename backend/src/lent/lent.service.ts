import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import LentType from 'src/enums/lent.type.enum';
import { ILentRepository } from './repository/lent.repository.interface';
import { BanService } from '../ban/ban.service';
import { LentTools } from './lent.component';
import { UserDto } from 'src/dto/user.dto';
import LentExceptionType from 'src/enums/lent.exception.enum';

@Injectable()
export class LentService {
  private logger = new Logger(LentService.name);
  constructor(
    @Inject('ILentRepository')
    private lentRepository: ILentRepository,
    private banService: BanService,
    @Inject(forwardRef(() => LentTools))
    private lentTools: LentTools,
  ) {}

  async lentCabinet(cabinet_id: number, user: UserDto): Promise<void> {
    this.logger.debug(`Called ${LentService.name} ${this.lentCabinet.name}`);
    try {
      // 유저가 대여한 사물함 확인
      if (await this.lentRepository.getIsLent(user.user_id)) {
        throw new HttpException(
          `🚨 이미 대여중인 사물함이 있습니다 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const excepction_type = await this.lentTools.lentStateTransition(
        user,
        cabinet_id,
      );
      switch (excepction_type) {
        case LentExceptionType.LENT_CLUB:
          throw new HttpException(
            `🚨 해당 사물함은 동아리 전용 사물함입니다 🚨`,
            HttpStatus.I_AM_A_TEAPOT,
          );
        case LentExceptionType.LENT_UNDER_PENALTY_DAY_SHARE:
          throw new HttpException(
            `🚨 만료기한이 얼마남지 않은 공유 사물함은 대여할 수 없습니다 🚨`,
            HttpStatus.FORBIDDEN,
          );
        case LentExceptionType.LENT_FULL:
          throw new HttpException(
            `🚨 해당 사물함에 잔여 자리가 없습니다 🚨`,
            HttpStatus.CONFLICT,
          );
        case LentExceptionType.LENT_EXPIRED:
          throw new HttpException(
            `🚨 연체된 사물함은 대여할 수 없습니다 🚨`,
            HttpStatus.FORBIDDEN,
          );
        case LentExceptionType.LENT_BROKEN:
          throw new HttpException(
            `🚨 고장난 사물함은 대여할 수 없습니다 🚨`,
            HttpStatus.FORBIDDEN,
          );
        case LentExceptionType.LENT_BANNED:
          throw new HttpException(
            '🚨 해당 사물함은 비활성화된 사물함입니다 🚨',
            HttpStatus.FORBIDDEN,
          );
      }
    } catch (err) {
      throw err;
    }
  }

  async updateLentCabinetTitle(
    cabinet_title: string,
    user: UserDto,
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
    user: UserDto,
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

  async returnCabinet(user: UserDto): Promise<void> {
    this.logger.debug(`Called ${LentService.name} ${this.returnCabinet.name}`);
    try {
      // 1. 해당 유저가 대여중인 cabinet_id를 가져온다.
      const cabinet_id = await this.lentRepository.getLentCabinetId(
        user.user_id,
      );
      if (cabinet_id === null) {
        throw new HttpException(
          `${user.intra_id} doesn't lent cabinet!`,
          HttpStatus.FORBIDDEN,
        );
      }
      const [lent, lent_type] = await this.lentTools.returnStateTransition(
        cabinet_id,
        user,
      );
      // 4. Lent Log Table에서 값 추가.
      await this.lentRepository.addLentLog(lent, user, cabinet_id);
      // 5. 공유 사물함은 72시간 내에 중도 이탈한 경우 해당 사용자에게 72시간 밴을 부여.
      if (lent_type === LentType.SHARE) {
        await this.banService.blockingDropOffUser(lent);
      }
    } catch (err) {
      throw err;
    }
  }
}
