import {
  Controller,
  Get,
  Logger,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import LentType from 'src/enums/lent.type.enum';
import { CabinetInfoPagenationDto } from '../dto/cabinet.info.pagenation.dto';
import { AdminStatisticsDto } from 'src/admin/dto/admin.statstics.dto';
import { UserInfoPagenationDto } from '../dto/user.info.pagenation.dto';
import { BrokenCabinetInfoPagenationDto } from '../dto/broken.cabinet.info.pagenation.dto';
import { BlockedUserInfoPagenationDto } from '../dto/blocked.user.info.pagenation.dto';
import { AdminSearchService } from './search.service';
import { AdminJwtAuthGuard } from 'src/admin/auth/jwt/guard/jwtauth.guard';
import { UserCabinetInfoPagenationDto } from '../dto/user.cabinet.info.pagenation.dto';
import { OverdueUserInfoPagenationDto } from '../dto/OverdueUserInfoPagenationDto';

@ApiTags('(Admin) Search')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: '로그아웃 상태',
})
@Controller('/api/admin/search')
@UseGuards(AdminJwtAuthGuard)
export class SearchController {
  private logger = new Logger(SearchController.name);
  constructor(private readonly adminSearchService: AdminSearchService) {}

  @ApiOperation({
    summary: '인트라 아이디 검색',
    description:
      '인트라 아이디에 대한 검색결과를 가지고 옵니다. 페이지네이션을 지원합니다.',
  })
  @ApiQuery({
    name: 'page',
    description: '(페이지네이션) 가져올 데이터 페이지',
  })
  @ApiQuery({
    name: 'length',
    description: '(페이지네이션) 가져올 데이터 길이',
  })
  @ApiParam({
    name: 'intraId',
    description: '인트라 아이디',
  })
  @Get('/intraId/:intraId')
  async getUserListByIntraId(
    @Param('intraId') intraId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<UserInfoPagenationDto> {
    this.logger.debug(`Called ${this.getUserListByIntraId.name}`);
    try {
      return await this.adminSearchService.searchByIntraId(
        intraId,
        page,
        length,
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @ApiOperation({
    summary: '인트라 아이디 검색',
    description:
      'intraId를 포함하는 유저들을 찾아서 대여중인 사물함 정보와 사물함을 대여중인 유저들의 정보를 반환합니다.',
  })
  @ApiQuery({
    name: 'page',
    description: '(페이지네이션) 가져올 데이터 페이지',
  })
  @ApiQuery({
    name: 'length',
    description: '(페이지네이션) 가져올 데이터 길이',
  })
  @ApiParam({
    name: 'intraId',
    description: '인트라 아이디',
  })
  @Get(':intraId')
  async searchUserCabinetListByIntraId(
    @Param('intraId') intraId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<UserCabinetInfoPagenationDto> {
    this.logger.debug(`Called ${this.searchUserCabinetListByIntraId.name}`);
    try {
      return await this.adminSearchService.searchUserCabinetListByIntraId(
        intraId,
        page,
        length,
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @ApiOperation({
    summary: '특정 캐비넷 타입인 사물함 리스트 검색',
    description:
      '특정 캐비넷 타입인 사물함 리스트를 가지고 옵니다. 페이지네이션을 지원합니다.',
  })
  @ApiQuery({
    name: 'page',
    description: '(페이지네이션) 가져올 데이터 페이지',
  })
  @ApiQuery({
    name: 'length',
    description: '(페이지네이션) 가져올 데이터 길이',
  })
  @ApiParam({
    name: 'lentType',
    description: '대여 타입 (ENUM)',
    enum: LentType,
  })
  @ApiOkResponse({
    type: CabinetInfoPagenationDto,
    description: '검색 결과를 받아옵니다.',
  })
  @Get('/cabinet/lentType/:lentType')
  async getCabinetListByLentType(
    @Param('lentType', new ParseEnumPipe(LentType)) lentType: LentType,
    @Query('page', ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<CabinetInfoPagenationDto> {
    this.logger.debug(`Called ${this.getCabinetListByLentType.name}`);
    try {
      return await this.adminSearchService.searchByLentType(
        lentType,
        page,
        length,
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @ApiOperation({
    summary: '해당 사물함 번호를 가진 사물함 리스트',
    description:
      '해당 사물함 번호를 가진 사물함 리스트를 반환합니다. 선택적으로 특정 층을 지정할 수 있습니다.',
  })
  @ApiParam({
    name: 'visibleNum',
    description: '사물함 번호',
  })
  @ApiOkResponse({
    type: CabinetInfoPagenationDto,
    description: '검색 결과를 받아옵니다.',
  })
  @Get('/cabinet/visibleNum/:visibleNum')
  async getCabinetListByVisibleNum(
    @Param('visibleNum', ParseIntPipe) visibleNum: number,
    @Query('floor') floor?: number,
  ): Promise<CabinetInfoPagenationDto> {
    this.logger.debug(`Called ${this.getCabinetListByVisibleNum.name}`);
    try {
      return await this.adminSearchService.searchByCabinetNumber(
        visibleNum,
        floor,
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @ApiOperation({
    summary: '정지당한 사물함 리스트',
    description:
      '정지당한 사물함 리스트를 반환합니다. 페이지네이션을 지원합니다.',
  })
  @ApiQuery({
    name: 'page',
    description: '(페이지네이션) 가져올 데이터 페이지',
  })
  @ApiQuery({
    name: 'length',
    description: '(페이지네이션) 가져올 데이터 길이',
  })
  @ApiOkResponse({
    type: CabinetInfoPagenationDto,
    description: '검색 결과를 받아옵니다.',
  })
  @Get('/cabinet/banned')
  async getBannedCabinetList(
    @Query('page', ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<CabinetInfoPagenationDto> {
    this.logger.debug(`Called ${this.getBannedCabinetList.name}`);
    try {
      return await this.adminSearchService.searchByBannedCabinet(page, length);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @ApiOperation({
    summary: '고장난 사물함 리스트',
    description:
      '고장난 사물함 리스트를 반환합니다. 페이지네이션을 지원합니다.',
  })
  @ApiQuery({
    name: 'page',
    description: '(페이지네이션) 가져올 데이터 페이지',
  })
  @ApiQuery({
    name: 'length',
    description: '(페이지네이션) 가져올 데이터 길이',
  })
  @ApiOkResponse({
    type: BrokenCabinetInfoPagenationDto,
    description: '부서진 사물함을 받아옵니다.',
  })
  @Get('/cabinet/broken')
  async getBrokenCabinetList(
    @Query('page', ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<BrokenCabinetInfoPagenationDto> {
    this.logger.debug(`Called ${this.getBrokenCabinetList.name}`);
    try {
      return await this.adminSearchService.searchByBrokenCabinet(page, length);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @ApiOperation({
    summary: '밴 당한 유저 리스트',
    description: '밴 당한 유저 리스트를 반환합니다. 페이지네이션을 지원합니다.',
  })
  @ApiQuery({
    name: 'page',
    description: '(페이지네이션) 가져올 데이터 페이지',
  })
  @ApiQuery({
    name: 'length',
    description: '(페이지네이션) 가져올 데이터 길이',
  })
  @ApiOkResponse({
    type: BlockedUserInfoPagenationDto,
    description: '블록된 유저들을 받아옵니다.',
  })
  @Get('/user/banned')
  async getBannedUserList(
    @Query('page') page: number,
    @Query('length') length: number,
  ): Promise<BlockedUserInfoPagenationDto> {
    this.logger.debug(`Called ${this.getBannedUserList.name}`);
    try {
      return await this.adminSearchService.searchByBanUser(page, length);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @ApiOperation({
    summary: '연체중인 유저 리스트',
    description:
      '연체중인 유저 리스트를 반환합니다. 페이지네이션을 지원합니다.',
  })
  @ApiQuery({
    name: 'page',
    description: '(페이지네이션) 가져올 데이터 페이지',
  })
  @ApiQuery({
    name: 'length',
    description: '(페이지네이션) 가져올 데이터 길이',
  })
  @ApiOkResponse({
    type: BlockedUserInfoPagenationDto,
    description: '연체중인 유저들을 받아옵니다.',
  })
  @Get('/user/overdue')
  async getOverdueUserList(
    @Query('page') page: number,
    @Query('length') length: number,
  ): Promise<OverdueUserInfoPagenationDto> {
    this.logger.debug(`Called ${this.getBannedUserList.name}`);
    try {
      return await this.adminSearchService.searchByOverdueUser(page, length);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @ApiOperation({
    summary: '기간별 대여/반납 횟수',
    description:
      '현재일자 기준, 입력한 일자만큼 이전에 일어난 대여, 반납의 횟수를 반환합니다.',
  })
  @ApiQuery({
    name: 'days',
    description: '현재일자를 기준으로 조회하고 싶은 일자',
  })
  @ApiOkResponse({
    type: AdminStatisticsDto,
    description:
      '현재를 기준으로한 이전 일자, 대여 횟수, 반납 횟수를 객체로 응답받습니다.',
  })
  @Get('cabinet/statistics/')
  async getLentReturnStatisticsByDaysFromNow(
    @Query('start') start: number,
    @Query('end') end: number,
  ): Promise<AdminStatisticsDto> {
    this.logger.debug(`Called ${this.getLentReturnStatisticsByDaysFromNow}`);
    try {
      return await this.adminSearchService.getLentReturnStatisticsByDaysFromNow(
        start,
        end,
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
