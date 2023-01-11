import { Controller, Delete, Logger, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/admin/auth/jwt/guard/jwtauth.guard';
import { AdminReturnService } from 'src/admin/return/return.service';


@ApiTags('(Admin) Return')
@Controller('/api/admin/return')
@UseGuards(AdminJwtAuthGuard)
export class AdminReturnController {
  private logger = new Logger(AdminReturnController.name);
  constructor(private adminReturnService: AdminReturnService) {}

  @Delete('/cabinet/:cabinetId')
  @ApiOperation({})
  async returnCabinetByCabinetId(
    @Param('cabinetId') cabinetId: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetByCabinetId.name}`);
    return await this.adminReturnService.returnCabinetByCabinetId(cabinetId);
  }

  @Delete('/user/:userId')
  @ApiOperation({})
  async returnCabinetByUserId(
    @Param('userId') userId: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetByUserId.name}`);
    return await this.adminReturnService.returnCabinetByUserId(userId);
  }

  @Delete('/bundle/cabinet')
  @ApiOperation({})
  async returnCabinetBundle(
    users: number[], 
    cabinets: number[]
  ): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetBundle.name}`);
    return await this.adminReturnService.returnCabinetBundle(users, cabinets);
  }
}
