import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { LogPagenationDto } from '../dto/log.pagenation.dto';
import { IAdminLogRepository } from 'src/admin/log/repository/log.interface.repository';

@Injectable()
export class AdminLogService {
  private logger = new Logger(AdminLogService.name);

  constructor(
    @Inject('IAdminLogRepository')
    private adminLogRepository: IAdminLogRepository,
  ) {}

  /**
   * 특정 유저의 사물함 대여 기록을 반환합니다.
   *
   * @param user_id 유저 고유 ID
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns LogPagenationDto
   * @throw HTTPError
   */
  async getLentLogByUserId(
    userId: number,
    page: number,
    length: number,
  ): Promise<LogPagenationDto> {
    const result = await this.adminLogRepository.getLentLogByUserId(
      userId,
      page,
      length,
    );
    if (page !== 0 && length !== 0 && result.total_length === 0) {
      throw new BadRequestException('로그가 없습니다');
    }
    return result;
  }

  /**
   * 특정 사물함의 대여 기록을 반환합니다.
   *
   * @param cabinet_id 캐비넷 고유 ID
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns LogPagenationDto
   * @throw HTTPError
   */
  async getLentLogByCabinetId(
    cabinetId: number,
    page: number,
    length: number,
  ): Promise<LogPagenationDto> {
    const result = await this.adminLogRepository.getLentLogByCabinetId(
      cabinetId,
      page,
      length,
    );
    if (page !== 0 && length !== 0 && result.total_length === 0) {
      throw new BadRequestException('로그가 없습니다');
    }
    return result;
  }
}
