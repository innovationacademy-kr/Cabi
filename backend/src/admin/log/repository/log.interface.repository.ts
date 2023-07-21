import { LogPagenationDto } from 'src/admin/dto/log.pagenation.dto';

export interface IAdminLogRepository {
  /**
   * 유저 ID로 렌트 기록을 가져옵니다.
   *
   * @return void
   */
  getLentLogByUserId(
    userId: number,
    page: number,
    length: number,
  ): Promise<LogPagenationDto>;

  /**
   * 캐비닛 ID로 렌트 기록을 가져옵니다.
   *
   * @return void
   */
  getLentLogByCabinetId(
    cabinetId: number,
    page: number,
    length: number,
  ): Promise<LogPagenationDto>;

  /**
   * 해당 유저의 최근 ban log를 삭제합니다.
   *
   * @param userId
   */
  deleteBanLogByUserId(userId: number): Promise<void>;
}
