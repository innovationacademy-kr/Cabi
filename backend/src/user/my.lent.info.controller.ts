import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LogPagenationDto } from 'src/admin/dto/log.pagenation.dto';
import { AdminLogService } from 'src/admin/log/log.service';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { User } from 'src/decorator/user.decorator';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('api/my_lent_info')
export class MyLentInfoController {
  private logger = new Logger(MyLentInfoController.name);

  constructor(
    private userService: UserService,
    private adminLogService: AdminLogService) {}

  @ApiOperation({
    summary: '자기 자신의 대여 정보를 가져옴.',
    description:
      '본인이 대여한 사물함 정보를 가져옵니다. 만약 빌린 사물함이 없을 경우 204 No Content를 반환합니다.',
  })
  @ApiOkResponse({
    description: '대여한 사물함 정보 반환',
  })
  @ApiNoContentResponse({
    description: '대여한 사물함 없음',
  })
  @ApiForbiddenResponse({
    description: 'ban 당한 상태임',
  })
  @ApiUnauthorizedResponse({
    description: '로그아웃 상태거나 JWT 세션이 만료됨',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyLentInfo(
    @User() user: UserSessionDto,
  ): Promise<MyCabinetInfoResponseDto> {
    this.logger.debug(`call getMyLentInfo by ${user.intra_id}`);
    const result = await this.userService.getCabinetByUserId(user.user_id);
    if (result === null) {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }
    return result;
  }

  @Get('log/:index/:length')
  @UseGuards(JwtAuthGuard)
  async getMyLentLog(
    @User() user: UserSessionDto,
    @Param('index') index: number,
    @Param('length') length: number
  ): Promise<LogPagenationDto> {
    this.logger.debug(`call getMyLentLog by ${user.intra_id}`);
    const result = await this.adminLogService.getLentLogByUserId(user.user_id, index, length);
    return result;
  }
}
