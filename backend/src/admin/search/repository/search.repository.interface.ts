import { AdminStatisticsDto } from 'src/admin/dto/admin.statstics.dto';
import { BlockedUserInfoPagenationDto } from 'src/admin/dto/blocked.user.info.pagenation.dto';
import { BrokenCabinetInfoPagenationDto } from 'src/admin/dto/broken.cabinet.info.pagenation.dto';
import { CabinetInfoPagenationDto } from 'src/admin/dto/cabinet.info.pagenation.dto';
import { UserCabinetInfoPagenationDto } from 'src/admin/dto/user.cabinet.info.pagenation.dto';
import { UserInfoPagenationDto } from 'src/admin/dto/user.info.pagenation.dto';
import LentType from 'src/enums/lent.type.enum';

export interface IAdminSearchRepository {
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
   * intraId를 포함하는 유저들을 찾아서 대여중인 사물함 정보와 사물함을 대여중인 유저들의 정보를 반환합니다.
   *
   * @param intraId 인트라 아이디
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns UserCabinetInfoPagenationDto
   */
  searchUserCabinetListByIntraId(
    intraId: string,
    page: number,
    length: number,
  ): Promise<UserCabinetInfoPagenationDto>;

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

  /**
   * 현재일자 기준, 입력한 일자만큼 이전에 일어난 대여, 반납의 횟수를 반환합니다..
   *
   * @param date 현재를 기준으로 통계를 보고싶은 만큼의 이전일자
   * @returns AdminStatisticsDto
   * @throw HTTPError
   */
   getLentReturnStatisticsByDateFromNow(
	  date: number,
	): Promise<AdminStatisticsDto>;
}
