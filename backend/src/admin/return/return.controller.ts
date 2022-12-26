import { Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@Controller('/api/admin/return')
@UseGuards(JwtAuthGuard)
export class ReturnController {
  private logger = new Logger(ReturnController.name);

  @Get('/user/:userId')
  async getLentLogByUserId(
    @Param('userId') userId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getLentLogByUserId.name}`);
  }

  @Delete('/cabinet/:cabinetId')
  async returnCabinetByCabinetId(
    @Param('cabinetId') cabinetId: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetByCabinetId.name}`);
  }

  @Delete('/user/:userId')
  async returnCabinetByUserId(
    @Param('userId') userId: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetByUserId.name}`);
  }

  @Delete('/bundle/cabinet')
  async returnCabinetBundle(): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetBundle.name}`);
  }
}
