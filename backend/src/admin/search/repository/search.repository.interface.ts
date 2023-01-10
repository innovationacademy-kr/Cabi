import { BlockedUserInfoPagenationDto } from 'src/admin/dto/blocked.user.info.pagenation.dto';
import { BrokenCabinetInfoPagenationDto } from 'src/admin/dto/broken.cabinet.info.pagenation.dto';
import { CabinetInfoPagenationDto } from 'src/admin/dto/cabinet.info.pagenation.dto';
import { UserInfoPagenationDto } from 'src/admin/dto/user.info.pagenation.dto';
import LentType from 'src/enums/lent.type.enum';

export interface ISearchRepository {
  /**
   * 인트라 아이디에 대한 검색결과를 가지고 옵니다.
   *
   * @param intraId 인트라 아이디
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns CabinetInfoPagenationDto
   */
  searchByIntraId(
    intraId: string,
    page: number,
    length: number,
  ): Promise<UserInfoPagenationDto>;

  /**
   * 특정 캐비넷 타입인 사물함 리스트를 가지고 옵니다.
   *
   * @param lentType 대여 타입
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns CabinetInfoPagenationDto
   */
  searchByLentType(
    lentType: LentType,
    page: number,
    length: number,
  ): Promise<CabinetInfoPagenationDto>;

  /**
   * 해당 사물함 번호를 가진 사물함 리스트를 반환합니다.
   *
   * @param visibleNum 사물함 번호
   * @returns CabinetInfoPagenationDto
   */
  searchByCabinetNumber(visibleNum: number): Promise<CabinetInfoPagenationDto>;

  /**
   * 정지당한 사물함 리스트를 반환합니다.
   *
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns CabinetInfoPagenationDto
   */
  searchByBannedCabinet(
    page: number,
    length: number,
  ): Promise<CabinetInfoPagenationDto>;

  /**
   * 고장난 사물함 리스트를 반환합니다.
   *
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns BrokenCabinetInfoPagenationDto
   */
  searchByBrokenCabinet(
    page: number,
    length: number,
  ): Promise<BrokenCabinetInfoPagenationDto>;

  /**
   * 밴 당한 유저 리스트를 반환합니다.
   *
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns LogPagenationDto
   */
  searchByBanUser(
    page: number,
    length: number,
  ): Promise<BlockedUserInfoPagenationDto>;
}
