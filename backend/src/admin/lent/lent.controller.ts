import { Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminLentService } from 'src/admin/lent/lent.service';
import { AdminJwtAuthGuard } from 'src/admin/auth/jwt/guard/jwtauth.guard';
import { LentService } from 'src/lent/lent.service';
import { OverdueInfoDto } from 'src/admin/dto/overdue.info.dto';
import { LentInfoResponseDto } from 'src/admin/dto/lent.info.response.dto';

@ApiTags('(Admin) Lent')
@Controller('/api/admin/lent')
@UseGuards(AdminJwtAuthGuard)
export class AdminLentController {
  private logger = new Logger(AdminLentController.name);
  constructor(
    private adminLentService: AdminLentService,
    private lentService: LentService) {}

  @Get('/')
  @ApiOperation({})
  async getLentInfo(): Promise<LentInfoResponseDto> {
    this.logger.debug(`Called ${this.getLentInfo.name}`);
    return await this.adminLentService.getLentUserInfo();
  }

  @Get('/overdue')
  @ApiOperation({})
  async getLentOverdueInfo(): Promise<OverdueInfoDto[]> {
    this.logger.debug(`Called ${this.getLentOverdueInfo.name}`);
    return await this.adminLentService.getLentOverdue();
  }

  @Post('/cabinet/:cabinetId/:userId')
  @ApiOperation({})
  async postLentCabinet(
    @Param('cabinetId') cabinetId: number,
    @Param('userId') userId: number,
    @Param('intraId') intraId: string,
  ): Promise<any> {
    const user = {
      cabinet_id: cabinetId,
      user_id: userId,
      intra_id: intraId
    }
    this.logger.debug(`Called ${this.postLentCabinet.name}`);
    return await this.lentService.lentCabinet(cabinetId, user);
  }
}
