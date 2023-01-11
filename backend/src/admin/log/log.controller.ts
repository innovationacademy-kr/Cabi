import { Controller, Get, Inject, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogPagenationDto } from 'src/admin/dto/log.pagenation.dto';
import { AdminLogService } from 'src/admin/log/log.service';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';

@ApiTags('(Admin) Log')
@Controller('/api/admin/log')
@UseGuards(JwtAuthGuard)
export class AdminLogController {
  private logger = new Logger(AdminLogController.name);
  constructor(private adminLogService: AdminLogService){}

  @Get('/user/:userId')
  @ApiOperation({})
  async getLentLogByUserId(
    @Param('userId') userId: number,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<LogPagenationDto> {
    this.logger.debug(`Called ${this.getLentLogByUserId.name}`);
    const result = this.adminLogService.getLentLogByUserId(userId, index, length);
    return result;
  }

  @Get('/cabinet/:cabinetId')
  @ApiOperation({})
  async getLentLogByCabinetId(
    @Param('cabinetId') cabinetId: number,
    @Query('index') index: number,
    @Query('length') length: number,
  ): Promise<LogPagenationDto>{
    this.logger.debug(`Called ${this.getLentLogByCabinetId.name}`);
    const result = this.adminLogService.getLentLogByCabinetId(cabinetId, index, length);
    return result;
  }
}
