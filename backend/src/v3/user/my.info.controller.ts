import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { User } from 'src/auth/user.decorator';
import { UserLentResponseDto } from 'src/dto/response/lent.user.response.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { BanCheckGuard } from '../ban/guard/ban-check.guard';
import { UserService } from './user.service';

@ApiTags('(V3) User')
@Controller({
  version: '3',
  path: 'api/my_info',
})
export class MyInfoController {
  private logger = new Logger(MyInfoController.name);

  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: '자기 자신의 정보를 가져옴.',
    description:
      '본인의 인트라 ID, 고유 ID, 대여했을 경우 사물함 ID를 반환합니다. 만약 사물함을 빌리지 않았을 경우 -1을 반환합니다.',
  })
  @ApiOkResponse({
    description: '정보 리턴',
  })
  @ApiForbiddenResponse({
    description: 'ban 당한 상태임',
  })
  @ApiUnauthorizedResponse({
    description: '로그아웃 상태거나 JWT 세션이 만료됨',
  })
  @Get()
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async getMyInfo(@User() user: UserSessionDto): Promise<UserLentResponseDto> {
    this.logger.log(`call getMyInfo by ${user.intra_id}`);
    const result = await this.userService.checkUserBorrowed(user);
    return result;
  }
}
