import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
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
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { User } from 'src/auth/user.decorator';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { BanCheckGuard } from '../ban/guard/ban-check.guard';
import { UserService } from './user.service';

@ApiTags('(V3) User')
@Controller({
  version: '3',
  path: 'api/my_lent_info',
})
export class MyLentInfoController {
  private logger = new Logger(MyLentInfoController.name);

  constructor(private userService: UserService) {}

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
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async getMyLentInfo(
    @User() user: UserSessionDto,
  ): Promise<MyCabinetInfoResponseDto> {
    this.logger.log(`call getMyLentInfo by ${user.intra_id}`);
    const result = await this.userService.getCabinetByUserId(user.user_id);
    if (result === null) {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }
    return result;
  }
}
