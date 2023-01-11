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

  async returnUserCabinetByUserId(user_id: number): Promise<void> {
    this.logger.debug(
      `Called ${AdminReturnService.name} ${this.returnUserCabinetByUserId.name}`,
    );
    try {
      // 유저가 존재하는지 확인
      const user = await this.userService.getUserIfExist(user_id);
      if (!user) {
        throw new HttpException(
          `🚨 해당 유저가 존재하지 않습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      // 1. 해당 유저가 대여중인 cabinet_id를 가져온다.
      const cabinet_id = await this.lentTools.getLentCabinetId(user.user_id);
      if (cabinet_id === null) {
        throw new HttpException(
          `🚨 해당 유저가 대여중인 사물함이 없습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const lent = await this.returnTools.returnStateTransition(
        cabinet_id,
        user,
      );
      await this.adminReturnRepository.addLentLog(lent, user, cabinet_id);
    } catch (err) {
      throw err;
    }
  }

  async returnCabinetByCabinetId(cabinet_id: number): Promise<void> {
    this.logger.debug(
      `Called ${AdminReturnService.name} ${this.returnCabinetByCabinetId.name}`,
    );
    try {
      // 캐비넷이 존재하는지 확인
      if (!(await this.adminCabinetService.isCabinetExist(cabinet_id))) {
        throw new HttpException(
          `🚨 해당 캐비넷이 존재하지 않습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const users = await this.adminReturnRepository.getUsersByCabinetId(cabinet_id);
      if (users === null) {
        throw new HttpException(
          `🚨 해당 캐비넷을 대여중인 유저가 없습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      for await (const user_id of users) {
        await this.returnCabinetByCabinetId(user_id);
      }
    } catch (err) {
      throw err;
    }
  }

  async returnCabinetByUserId(user_id: number): Promise<void> {
    this.logger.debug(
      `Called ${AdminReturnService.name} ${this.returnCabinetByUserId.name}`,
    );
    try {
      // 유저가 존재하는지 확인
      const user = await this.userService.getUserIfExist(user_id);
      if (!user) {
        throw new HttpException(
          `🚨 해당 유저가 존재하지 않습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      // 1. 해당 유저가 대여중인 cabinet_id를 가져온다.
      const cabinet_id = await this.lentTools.getLentCabinetId(user.user_id);
      if (cabinet_id === null) {
        throw new HttpException(
          `🚨 해당 유저가 대여중인 사물함이 없습니다. 🚨`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const lent = await this.returnTools.returnStateTransition(
        cabinet_id,
        user,
      );
      await this.adminReturnRepository.addLentLog(lent, user, cabinet_id);
    } catch (err) {
      throw err;
    }
  }



}
