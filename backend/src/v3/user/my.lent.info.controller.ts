import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';

@ApiTags('User')
@Controller({
  version: '3',
  path: 'api/my_lent_info',
})
export class MyLentInfoController {
  private logger = new Logger(MyLentInfoController.name);

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
  @ApiUnauthorizedResponse({
    description: '로그아웃 상태거나 밴 된 사용자거나 JWT 세션이 만료됨',
  })
  @Get()
  @UseGuards(JwtAuthGuard /*, BanCheckGuard */)
  async getMyLentInfo(): Promise<MyCabinetInfoResponseDto> {
    return new MyCabinetInfoResponseDto();
  }
}
