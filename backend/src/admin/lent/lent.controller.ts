import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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
    private lentService: LentService,
  ) {}

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

  // FIXME: lentService에서 intraId 사용이 필요가 없으므로
  //        param으로 cabinetId, userId만 받아도 될 것 같습니다.
  //        user와 cabinet이 존재하는지 확인하는 로직이 없어 500이 발생합니다.
  //        user와 cabinet이 존재하지 않는다면 지금은 400을 반환하는 것이 맞습니다.
  //        하지만 400은 클라이언트의 요청 문법이 잘못되었을 때 사용하는 것이므로
  //        409를 응답하도록 수정하는게 좋을 것 같습니다.
  //        Return type이 any가 아닌 void로 수정해야 합니다.
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
      intra_id: intraId,
    };
    this.logger.debug(`Called ${this.postLentCabinet.name}`);
    return await this.lentService.lentCabinet(cabinetId, user);
  }
}
