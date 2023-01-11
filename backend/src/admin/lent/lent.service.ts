import { Inject, Injectable, Logger } from "@nestjs/common";
import { LentInfoResponseDto } from "src/admin/dto/lent.info.response.dto";
import { OverdueInfoDto } from "src/admin/dto/overdue-info.dto";
import { IAdminLentRepository } from "src/admin/lent/repository/lent.repository.interface";


@Injectable()
export class AdminLentService {
  private logger = new Logger(AdminLentService.name);

  constructor(
    @Inject('IAdminLentRepository')
    private adminLentRepository: IAdminLentRepository,
  ) {}

  async getLentUserInfo(): Promise<LentInfoResponseDto> {
    this.logger.debug('call getLentUserInfo');
    const result = await this.adminLentRepository.getLentInfo();

    return { lentInfo: result };
  }

  async getLentOverdue(): Promise<OverdueInfoDto[]> {
    this.logger.debug('call getLentOverdue');
    const result = await this.adminLentRepository.getLentOverdue();

    return result;
  }
}
