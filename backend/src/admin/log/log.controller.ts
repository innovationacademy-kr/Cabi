import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/admin/auth/jwt/guard/jwtauth.guard';
import { LogPagenationDto } from 'src/admin/dto/log.pagenation.dto';
import { AdminLogService } from 'src/admin/log/log.service';

@ApiTags('(Admin) Log')
@Controller('/api/admin/log')
@UseGuards(AdminJwtAuthGuard)
export class AdminLogController {
  private logger = new Logger(AdminLogController.name);
  constructor(private adminLogService: AdminLogService) {}

  @Get('/user/:userId')
  @ApiOperation({})
  async getLentLogByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number,
    @Query('length') length: number,
  ): Promise<LogPagenationDto> {
    this.logger.debug(`Called ${this.getLentLogByUserId.name}`);
    const result = this.adminLogService.getLentLogByUserId(
      userId,
      page,
      length,
    );
    return result;
  }

  @Get('/cabinet/:cabinetId')
  @ApiOperation({})
  async getLentLogByCabinetId(
    @Param('cabinetId') cabinetId: number,
    @Query('page') page: number,
    @Query('length') length: number,
  ): Promise<LogPagenationDto> {
    this.logger.debug(`Called ${this.getLentLogByCabinetId.name}`);
    const result = this.adminLogService.getLentLogByCabinetId(
      cabinetId,
      page,
      length,
    );
    return result;
  }

  @Delete('/ban/:userId')
  @ApiOperation({
    summary: '해당 인트라 아이디에 대해 가장 최근 ban log를 삭제',
    description: '인트라 아이디에 대한 ban log를 삭제합니다.',
  })
  async deleteBanLogByUserId(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.deleteBanLogByUserId.name}`);
    this.adminLogService.deleteBanLogByUserId(userId);
  }
}
