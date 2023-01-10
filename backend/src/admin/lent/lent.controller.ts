import { Controller, Get, Inject, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminLentService } from 'src/admin/lent/lent.service';
import { JwtAuthGuard } from 'src/admin/auth/jwt/guard/jwtauth.guard';
import { LentService } from 'src/lent/lent.service';

@ApiTags('(Admin) Lent')
@Controller('/api/admin/lent')
@UseGuards(JwtAuthGuard)
export class LentController {
  private logger = new Logger(LentController.name);
  constructor(
    private lentService: AdminLentService,
    private mainLentService: LentService) {}

  @Get('/')
  @ApiOperation({})
  async getLentInfo(): Promise<void> {
    this.logger.debug(`Called ${this.getLentInfo.name}`);
  }

  @Get('/overdue')
  @ApiOperation({})
  async getLentOverdueInfo(): Promise<void> {
    this.logger.debug(`Called ${this.getLentOverdueInfo.name}`);
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
    return this.mainLentService.lentCabinet(cabinetId, user);
  }
  // Main의 lentCabinet 함수를 이용하였습니다.
}
