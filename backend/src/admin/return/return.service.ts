import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { AdminCabinetService } from "src/admin/cabinet/cabinet.service";
import { IAdminReturnRepository } from "src/admin/return/repository/return.repository.interface";
import { ReturnTools } from "src/admin/return/return.component";
import { LentTools } from "src/lent/lent.component";
import { UserService } from "src/user/user.service";

@Injectable()
export class AdminReturnService {
  private logger = new Logger(AdminReturnService.name);

  constructor(
    @Inject('IAdminReturnRepository')
    private adminReturnRepository: IAdminReturnRepository,
    private userService: UserService,
    private lentTools: LentTools,
    private returnTools: ReturnTools,
    private adminCabinetService: AdminCabinetService,
  ) {}

  async returnUserCabinetByUserId(userId: number): Promise<void> {
    this.logger.debug(
      `Called ${AdminReturnService.name} ${this.returnUserCabinetByUserId.name}`,
    );
    try {
      // 유저가 존재하는지 확인
      const user = await this.userService.getUserIfExist(userId);
      if (!user) {
        throw new HttpException(
          `🚨 해당 유저가 존재하지 않습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      // 1. 해당 유저가 대여중인 cabinet_id를 가져온다.
      const cabinetId = await this.lentTools.getLentCabinetId(user.user_id);
      if (cabinetId === null) {
        throw new HttpException(
          `🚨 해당 유저가 대여중인 사물함이 없습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const lent = await this.returnTools.returnStateTransition(
        cabinetId,
        user,
      );
      await this.adminReturnRepository.addLentLog(lent, user, cabinetId);
    } catch (err) {
      throw err;
    }
  }

  async returnCabinetByCabinetId(cabinetId: number): Promise<void> {
    this.logger.debug(
      `Called ${AdminReturnService.name} ${this.returnCabinetByCabinetId.name}`,
    );
    try {
      // 캐비넷이 존재하는지 확인
      if (!(await this.adminCabinetService.isCabinetExist(cabinetId))) {
        throw new HttpException(
          `🚨 해당 캐비넷이 존재하지 않습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const users = await this.adminReturnRepository.getUsersByCabinetId(cabinetId);
      if (users === null) {
        throw new HttpException(
          `🚨 해당 캐비넷을 대여중인 유저가 없습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      for await (const userId of users) {
        await this.returnUserCabinetByUserId(userId);
      }
    } catch (err) {
      throw err;
    }
  }

  async returnCabinetByUserId(userId: number): Promise<void> {
    this.logger.debug(
      `Called ${AdminReturnService.name} ${this.returnCabinetByUserId.name}`,
    );
    try {
      // 유저가 존재하는지 확인
      const user = await this.userService.getUserIfExist(userId);
      if (!user) {
        throw new HttpException(
          `🚨 해당 유저가 존재하지 않습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      // 1. 해당 유저가 대여중인 cabinet_id를 가져온다.
      const cabinetId = await this.lentTools.getLentCabinetId(user.user_id);
      if (cabinetId === null) {
        throw new HttpException(
          `🚨 해당 유저가 대여중인 사물함이 없습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const lent = await this.returnTools.returnStateTransition(
        cabinetId,
        user,
      );
      await this.adminReturnRepository.addLentLog(lent, user, cabinetId);
    } catch (err) {
      throw err;
    }
  }

  async returnCabinetBundle(users: number[], cabinets: number[]): Promise<void> {
    this.logger.debug(`Called ${AdminReturnService.name} ${this.returnCabinetBundle.name}`);
    const userFailures = [];
    const cabinetsFailures = [];
    if (users) {
      for await (const userId of users) {
        await this.returnUserCabinetByUserId(userId).catch(() => {
          userFailures.push(userId);
        });
      }
    }
    if (cabinets) {
      for await (const cabinetId of cabinets) {
        await this.returnCabinetByCabinetId(cabinetId).catch(() => {
          cabinetsFailures.push(cabinetId);
        });
      }
    }
    if (!(userFailures.length === 0 && cabinetsFailures.length === 0)) {
      throw new HttpException(
        {
          user_failures: userFailures,
          cabinet_failures: cabinetsFailures,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

}
