import { Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@Controller('/api/admin/lent')
@UseGuards(JwtAuthGuard)
export class LentController {
  private logger = new Logger(LentController.name);

  @Get('/')
  async getLentInfo(): Promise<void> {
    this.logger.debug(`Called ${this.getLentInfo.name}`);
  }

  @Get('/overdue')
  async getLentOverdueInfo(): Promise<void> {
    this.logger.debug(`Called ${this.getLentOverdueInfo.name}`);
  }

  @Post('/cabinet/:cabinetId/:userId')
  async postLentCabinet(
    @Param('cabinetId') cabinetId: number,
    @Param('userId') userId: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.postLentCabinet.name}`);
  }
}
