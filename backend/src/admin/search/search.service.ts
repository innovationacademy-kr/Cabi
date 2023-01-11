import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserInfoPagenationDto } from '../dto/user.info.pagenation.dto';
import LentType from 'src/enums/lent.type.enum';
import { CabinetInfoPagenationDto } from '../dto/cabinet.info.pagenation.dto';
import { BrokenCabinetInfoPagenationDto } from '../dto/broken.cabinet.info.pagenation.dto';
import { BlockedUserInfoPagenationDto } from '../dto/blocked.user.info.pagenation.dto';
import { IAdminSearchRepository } from './repository/search.repository.interface';

@Injectable()
export class AdminSearchService {
  private logger = new Logger(AdminSearchService.name);
  constructor(
    @Inject('IAdminSearchRepository')
    private adminSearchRepository: IAdminSearchRepository,
  ) {}

  /**
   * 인트라 아이디에 대한 검색결과를 가지고 옵니다.
   *
   * @param intraId 인트라 아이디
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns CabinetInfoPagenationDto
   * @throw HTTPError
   */
  async searchByIntraId(
    intraId: string,
    page: number,
    length: number,
  ): Promise<UserInfoPagenationDto> {
    this.logger.debug(
      `Called ${AdminSearchService.name} ${this.searchByIntraId.name}`,
    );
    return await this.adminSearchRepository.searchByIntraId(intraId, page, length);
  }

  /**
   * 특정 캐비넷 타입인 사물함 리스트를 가지고 옵니다.
   *
   * @param lentType 대여 타입
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns CabinetInfoPagenationDto
   * @throw HTTPError
   */
  async searchByLentType(
    lentType: LentType,
    page: number,
    length: number,
  ): Promise<CabinetInfoPagenationDto> {
    this.logger.debug(
      `Called ${AdminSearchService.name} ${this.searchByLentType.name}`,
    );
    return await this.adminSearchRepository.searchByLentType(lentType, page, length);
  }

  /**
   * 해당 사물함 번호를 가진 사물함 리스트를 반환합니다.
   *
   * @param visibleNum 사물함 번호
   * @returns CabinetInfoPagenationDto
   * @throw HTTPError
   */
  async searchByCabinetNumber(
    visibleNum: number,
  ): Promise<CabinetInfoPagenationDto> {
    this.logger.debug(
      `Called ${AdminSearchService.name} ${this.searchByCabinetNumber.name}`,
    );
    return await this.adminSearchRepository.searchByCabinetNumber(visibleNum);
  }

  /**
   * 정지당한 사물함 리스트를 반환합니다.
   *
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns CabinetInfoPagenationDto
   * @throw HTTPError
   */
  async searchByBannedCabinet(
    page: number,
    length: number,
  ): Promise<CabinetInfoPagenationDto> {
    this.logger.debug(
      `Called ${AdminSearchService.name} ${this.searchByBannedCabinet.name}`,
    );
    return await this.adminSearchRepository.searchByBannedCabinet(page, length);
  }

  /**
   * 고장난 사물함 리스트를 반환합니다.
   *
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns BrokenCabinetInfoPagenationDto
   * @throw HTTPError
   */
  async searchByBrokenCabinet(
    page: number,
    length: number,
  ): Promise<BrokenCabinetInfoPagenationDto> {
    this.logger.debug(
      `Called ${AdminSearchService.name} ${this.searchByBrokenCabinet.name}`,
    );
    return await this.adminSearchRepository.searchByBrokenCabinet(page, length);
  }

  /**
   * 밴 당한 유저 리스트를 반환합니다.
   *
   * @param page 가져올 데이터 페이지
   * @param length 가져올 데이터 길이
   * @returns LogPagenationDto
   * @throw HTTPError
   */
  async searchByBanUser(
    page: number,
    length: number,
  ): Promise<BlockedUserInfoPagenationDto> {
    this.logger.debug(
      `Called ${AdminSearchService.name} ${this.searchByBanUser.name}`,
    );
    return await this.adminSearchRepository.searchByBanUser(page, length);
  }
}
