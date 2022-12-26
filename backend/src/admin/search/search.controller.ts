import { Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@ApiTags('(Admin) Search')
@Controller('/api/admin/search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  private logger = new Logger(SearchController.name);

  @Get('/intraId/:intraId')
  @ApiOperation({})
  async getUserListByIntraId(
    @Param('intraId') intraId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getUserListByIntraId.name}`);
  }

  @Get('/cabinet/lentType/:lentType')
  @ApiOperation({})
  async getCabinetListByLentType(
    @Param('lentType') lentType: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getCabinetListByLentType.name}`);
  }

  @Get('/cabinet/visibleNum/:visibleNum')
  @ApiOperation({})
  async getCabinetListByVisibleNum(
    @Param('visibleNum') visibleNum: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getCabinetListByVisibleNum.name}`);
  }

  @Get('/cabinet/banned')
  @ApiOperation({})
  async getBannedCabinetList(
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getBannedCabinetList.name}`);
  }

  @Get('/cabinet/broken')
  @ApiOperation({})
  async getBrokenCabinetList(
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getBrokenCabinetList.name}`);
  }

  @Get('/user/banned')
  @ApiOperation({})
  async getBannedUserList(
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getBannedUserList.name}`);
  }
}
