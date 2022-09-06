import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CabinetListDto } from './dto/cabinet-list.dto';
import { CabinetService } from './cabinet.service';
import { MyLentInfoDto } from './dto/my-lent-info.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { User } from 'src/auth/user.decorator';
import { lentCabinetInfoDto } from './dto/cabinet-lent-info.dto';
import { BanCheckGuard } from 'src/ban/guard/ban-check.guard';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { UserDto } from 'src/user/dto/user.dto';

@ApiTags('Cabinet')
@Controller('api')
export class CabinetController {
  private logger = new Logger(CabinetController.name);

  constructor(private cabinetService: CabinetService) {}

  @ApiOperation({
    summary: '전체 사물함 정보 호출',
    description: '전체 사물함 정보를 가져옵니다.',
  })
  // NOTE: 의도된 방식인진 모르겠제만 해당 엔드포인트에 대해선 auth 체크를 하지 않습니다.
  @Post('cabinet')
  async postCabinet(): Promise<CabinetListDto> {
    // 전체 사물함에 대한 정보
    this.logger.log('postCabinet');
    const cabinet = await this.cabinetService.getAllCabinets();
    if (cabinet.location?.length === 0) {
      throw new BadRequestException({ error: 'no cabinet information' });
    }
    return cabinet;
  }

  @ApiOperation({
    summary: '대여자 정보 호출',
    description: '현재 모든 사물함 대여자의 정보를 가져옵니다.',
  })
  @Post('lent_info')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async postLentInfo(@User() user: UserSessionDto): Promise<MyLentInfoDto> {
    // 현재 모든 대여자들의 정보
    // FIXME: 대여를 한 유저가 있으면 추가로 대여하지 못하게 막는 로직은
    //         API를 따로 만들어 분리를 하는게 좋을 것 같습니다.
    this.logger.log('postLentInfo');
    const userId = user.user_id;
    return this.cabinetService.getAllLentInfo(userId);
  }

  @ApiOperation({
    summary: '사물함 대여',
    description: '특정 사물함을 대여합니다.',
  })
  @Post('lent')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async postLent(
    @User() user: UserSessionDto,
    @Body(ValidationPipe) cabinet: { cabinet_id: number },
  ): Promise<{ cabinet_id: number }> {
    // 특정 사물함을 빌릴 때 요청
    this.logger.log('postLent');
    return this.cabinetService.lentCabinet(user, cabinet.cabinet_id);
  }

  @ApiOperation({
    summary: '유저의 대여 중 사물함 정보',
    description: '특정 유저가 현재 대여하고 있는 사물함의 정보를 가져옵니다.',
  })
  @Post('return_info')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async postReturnInfo(
    @User() user: UserSessionDto,
  ): Promise<lentCabinetInfoDto> {
    // 특정 사용자가 현재 대여하고 있는 사물함의 정보
    this.logger.log('postReturnInfo');
    return await this.cabinetService.getUser(user);
  }

  /**
   * 특정 사물함을 반납할 때 요청
   * @param UserSessionDto
   * @return Promise<void>
   * FIXME: Lent Controller에 들어가는게 적절할 것 같습니다.
   */
  @ApiOperation({
    summary: '사물함 반납',
    description: ' 특정 사물함을 반납을 처리합니다.',
  })
  @Post('return')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async postReturn(@User() userSession: UserSessionDto): Promise<number> {
    let user: UserDto = {
      user_id: userSession.user_id,
      intra_id: userSession.intra_id,
    }
    return await this.cabinetService.createLentLog(user);
  }

  /**
   * 적절한 유저가 페이지를 접근하는지에 대한 정보
   * @param UserSessionDto
   * @return Promise<{ user: UserSessionDto }>
   * FIXME: Auth Controller에 들어가는게 더 적절할 것 같습니다.
   */
  @ApiOperation({
    summary: '페이지 접근 권한',
    description: '유저의 페이지 접근 권한 여부 정보를 리턴합니다.',
  })
  @Post('check')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  postCheck(@User() user: UserSessionDto): { user: UserSessionDto } {
    return { user };
  }

  /**
   * 대여 연장 요청이 들어올 때 이를 처리하는 api
   * @param UserSessionDto
   * @return Promise<void>
   * FIXME: Lent Controller에 들어가는게 적절할 것 같습니다.
   * FIXME: 새 대여 정책에서 해당 연장 기능이 없어질 수 있음.
   * TODO: Lent Service에 activateExtension 포팅 필요.
   */
  @ApiOperation({
    summary: '사물함 연장',
    description: '특정 사물함의 대여기간을 연장합니다.',
  })
  @Post('extension')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async postExtension(@User() user: UserSessionDto): Promise<void> {
    // 추후 lentService로 변경해야 함.
    return await this.cabinetService.activateExtension(user);
  }
}
