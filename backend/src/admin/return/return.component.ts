import { Inject, Injectable, Logger } from "@nestjs/common";
import { AdminCabinetService } from "src/admin/cabinet/cabinet.service";
import { IAdminReturnRepository } from "src/admin/return/repository/return.repository.interface";
import { BanService } from "src/ban/ban.service";
import { UserDto } from "src/dto/user.dto";
import Lent from "src/entities/lent.entity";
import CabinetStatusType from "src/enums/cabinet.status.type.enum";
import { DateCalculator } from "src/utils/date.calculator.component";
import { IsolationLevel, Propagation, runOnTransactionComplete, Transactional } from "typeorm-transactional";

@Injectable()
export class ReturnTools {
  private logger = new Logger(ReturnTools.name);
  constructor(
    @Inject('IAdminReturnRepository')
    private adminReturnRepository: IAdminReturnRepository,
    private adminCabinetService: AdminCabinetService,
    private banService: BanService,
    private dateCalculator: DateCalculator,
  ) {}

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async clearCabinetInfo(cabinet_id: number): Promise<void> {
    this.logger.debug(
      `Called ${ReturnTools.name} ${this.clearCabinetInfo.name}`,
    );
    await this.adminReturnRepository.clearCabinetInfo(cabinet_id);
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async returnStateTransition(
    cabinet_id: number,
    user: UserDto,
  ): Promise<Lent> {
    this.logger.debug(
      `Called ${ReturnTools.name} ${this.returnStateTransition.name}`,
    );
    // 대여하고 있는 유저들의 대여 정보를 포함하는 cabinet 정보를 가져옴.
    // 가져오는 정보 : 캐비넷 상태, 캐비넷 대여타입, 캐비넷을 빌린 사람들의 인원 수
    const cabinet = await this.adminReturnRepository.getReturnCabinetData(
      cabinet_id,
    );
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
        await this.adminCabinetService.updateCabinetStatus(
          cabinet_id,
          CabinetStatusType.SET_EXPIRE_AVAILABLE,
        );
      case CabinetStatusType.SET_EXPIRE_AVAILABLE:
        if (lent_count - 1 === 0) {
          await this.adminCabinetService.updateCabinetStatus(
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
          await this.adminCabinetService.updateCabinetStatus(
            cabinet_id,
            CabinetStatusType.AVAILABLE,
          );
        }
        break;
    }
    // 3. Lent Table에서 값 제거.
    await this.adminReturnRepository.deleteLentByLentId(lent.lent_id);
    runOnTransactionComplete((err) => err && this.logger.error(err));
    return lent;
  }
}
