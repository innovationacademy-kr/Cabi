import { LentInfoDto } from 'src/admin/dto/lent.info.dto';
import { OverdueInfoDto } from 'src/admin/dto/overdue.info.dto';

export interface IAdminLentRepository {
  /**
   * 대여 사물함 정보 (lent id, cabinet id, user id, 빌린 시간, 만료 시간, 연장 여부, 인트라 아이디) 를 가져옵니다.
   *
   * @returns LentInfoDto[]
   */
  getLentInfo(): Promise<LentInfoDto[]>;

  /**
   * 연체된 사물함 리스트를 가져옵니다.
   *
   * @returns OverdueInfoDto[]
   */
  getLentOverdue(): Promise<OverdueInfoDto[]>;
}
