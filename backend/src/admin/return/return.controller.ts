import { Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@ApiTags('(Admin) Return')
@Controller('/api/admin/return')
@UseGuards(JwtAuthGuard)
export class ReturnController {
  private logger = new Logger(ReturnController.name);

  @Get('/user/:userId')
  @ApiOperation({})
  async getLentLogByUserId(
    @Param('userId') userId: string,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.getLentLogByUserId.name}`);
  }

  @Delete('/cabinet/:cabinetId')
  @ApiOperation({})
  async returnCabinetByCabinetId(
    @Param('cabinetId') cabinetId: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetByCabinetId.name}`);
  }

  @Delete('/user/:userId')
  @ApiOperation({})
  async returnCabinetByUserId(
    @Param('userId') userId: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetByUserId.name}`);
  }

  @Delete('/bundle/cabinet')
  @ApiOperation({})
  async returnCabinetBundle(): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetBundle.name}`);
  }
}
