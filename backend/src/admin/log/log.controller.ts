import { Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@ApiTags('(Admin) Log')
@Controller('/api/admin/log')
@UseGuards(JwtAuthGuard)
export class LogController {
  private logger = new Logger(LogController.name);

  @Get('/user/:userId')
  @ApiOperation({})
  async getLentLogByUserId(
    @Param('userId') userId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getLentLogByUserId.name}`);
  }

  @Get('/cabinet/:cabinetId')
  @ApiOperation({})
  async getLentLogByCabinetId(
    @Param('cabinetId') cabinetId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getLentLogByCabinetId.name}`);
  }
}
