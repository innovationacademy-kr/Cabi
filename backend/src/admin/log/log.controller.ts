import { Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@Controller('/api/admin/log')
@UseGuards(JwtAuthGuard)
export class LogController {
  private logger = new Logger(LogController.name);

  @Get('/user/:userId')
  async getLentLogByUserId(
    @Param('userId') userId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getLentLogByUserId.name}`);
  }

  @Get('/cabinet/:cabinetId')
  async getLentLogByCabinetId(
    @Param('cabinetId') cabinetId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getLentLogByCabinetId.name}`);
  }
}
