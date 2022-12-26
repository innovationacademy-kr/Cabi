import { Controller, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@ApiTags('(Admin) Cabinet')
@Controller('/api/admin/cabinet')
@UseGuards(JwtAuthGuard)
export class CabinetController {
  private logger = new Logger(CabinetController.name);

  @Get('/user/:userId')
  @ApiOperation({})
  async getLentLogByUserId(
    @Param('userId') userId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getLentLogByUserId.name}`);
  }

  @Get('/count/floor')
  @ApiOperation({})
  async getCabinetCountEachFloor(): Promise<void> {
    this.logger.debug(`Called ${this.getCabinetCountEachFloor.name}`);
  }

  @Get('/:cabinetId')
  @ApiOperation({})
  async getCabinetInfoByCabinetId(
    @Param('cabinetId') cabinetId: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getCabinetInfoByCabinetId.name}`);
  }

  @Patch('/status/:cabinetId/:status')
  @ApiOperation({})
  async updateCabinetStatusByCabinetId(
    @Param('cabinetId') cabinetId: string,
    @Param('status') status: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetStatusByCabinetId.name}`);
  }

  @Patch('/lentType/:cabinetId/:lentType')
  @ApiOperation({})
  async updateCabinetLentTypeByCabinetId(
    @Param('cabinetId') cabinetId: string,
    @Param('lentType') lentType: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetLentTypeByCabinetId.name}`);
  }

  @Patch('/statusNote/:cabinetId/:statusNote')
  @ApiOperation({})
  async updateCabinetStatusNoteByCabinetId(
    @Param('cabinetId') cabinetId: string,
    @Param('statusNote') statusNote: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetStatusNoteByCabinetId.name}`);
  }

  @Patch('/bundle/status/:status')
  @ApiOperation({})
  async updateCabinetBundleStatus(
    @Param('status') status: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetBundleStatus.name}`);
  }

  @Patch('/bundle/lentType/:lentType')
  @ApiOperation({})
  async updateCabinetBundleLentType(
    @Param('lentType') lentType: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetBundleLentType.name}`);
  }

  @Patch('/:cabinetId/:title')
  @ApiOperation({})
  async updateCabinetTitleByCabinetId(
    @Param('cabinetId') cabinetId: string,
    @Param('title') title: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetTitleByCabinetId.name}`);
  }
}
