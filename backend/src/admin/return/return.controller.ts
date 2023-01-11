import { Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/admin/auth/jwt/guard/jwtauth.guard';


@ApiTags('(Admin) Return')
@Controller('/api/admin/return')
@UseGuards(AdminJwtAuthGuard)
export class AdminReturnController {
  private logger = new Logger(AdminReturnController.name);

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
