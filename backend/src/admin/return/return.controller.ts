import {
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/admin/auth/jwt/guard/jwtauth.guard';
import { AdminReturnService } from 'src/admin/return/return.service';

@ApiTags('(Admin) Return')
@Controller('/api/admin/return')
@UseGuards(AdminJwtAuthGuard)
export class AdminReturnController {
  private logger = new Logger(AdminReturnController.name);
  constructor(private adminReturnService: AdminReturnService) {}

  //FIXME: 해당 사물함이 존재하지 않거나, 해당 사물함을 대여중인 유저가 없는 경우,
  //       하지만 400은 클라이언트의 요청 문법이 잘못되었을 때 사용하는 것이므로
  //       409를 응답하도록 수정하는게 좋을 것 같습니다.
  @Delete('/cabinet/:cabinetId')
  @ApiOperation({})
  async returnCabinetByCabinetId(
    @Param('cabinetId') cabinetId: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetByCabinetId.name}`);
    return await this.adminReturnService.returnCabinetByCabinetId(cabinetId);
  }

  //FIXME: 해당 유저가 존재하지 않거나, 해당 유저가 대여중인 사물함이 없는 경우,
  //       하지만 400은 클라이언트의 요청 문법이 잘못되었을 때 사용하는 것이므로
  //       409를 응답하도록 수정하는게 좋을 것 같습니다.
  @Delete('/user/:userId')
  @ApiOperation({})
  async returnCabinetByUserId(@Param('userId') userId: number): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetByUserId.name}`);
    return await this.adminReturnService.returnCabinetByUserId(userId);
  }

  //FIXME: 하나 이상 반납 처리에 실패한 경우, 400이 응답되고 있습니다.
  //       하지만 400은 클라이언트의 요청 문법이 잘못되었을 때 사용하는 것이므로
  //       409를 응답하도록 수정하는게 좋을 것 같습니다.
  @Delete('/bundle/cabinet')
  @ApiOperation({})
  async returnCabinetBundle(@Body('bundle') bundle: number[]): Promise<void> {
    this.logger.debug(`Called ${this.returnCabinetBundle.name}`);
    return await this.adminReturnService.returnCabinetBundle(bundle);
  }
}
