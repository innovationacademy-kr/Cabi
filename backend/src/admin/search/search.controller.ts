import { Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@Controller('/api/admin/search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  private logger = new Logger(SearchController.name);

  @Get('/intraId/:intraId')
  async getUserListByIntraId(
    @Param('intraId') intraId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getUserListByIntraId.name}`);
  }

  @Get('/cabinet/lentType/:lentType')
  async getCabinetListByLentType(
    @Param('lentType') lentType: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getCabinetListByLentType.name}`);
  }

  @Get('/cabinet/visibleNum/:visibleNum')
  async getCabinetListByVisibleNum(
    @Param('visibleNum') visibleNum: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getCabinetListByVisibleNum.name}`);
  }

  @Get('/cabinet/banned')
  async getBannedCabinetList(
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getBannedCabinetList.name}`);
  }

  @Get('/cabinet/broken')
  async getBrokenCabinetList(
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getBrokenCabinetList.name}`);
  }

  @Get('/user/banned')
  async getBannedUserList(
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getBannedUserList.name}`);
  }
}
