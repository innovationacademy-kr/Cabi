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
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { User } from 'src/auth/user.decorator';
import { AuthService } from 'src/auth/auth.service';

@Controller('api')
export class CabinetController {
  private logger = new Logger(CabinetController.name);

  constructor(
    private cabinetService: CabinetService,
    private authService: AuthService,
  ) {}

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

  @Post('lent_info')
  async postLentInfo(): Promise<MyLentInfoDto> {
    // 현재 모든 대여자들의 정보
    this.logger.log('postLentInfo');
    const userId = 12345; // TODO: 실제 유저 ID를 받아야 함.
    return this.cabinetService.getAllLentInfo(userId);
  }

  //getUser는 userService에 들어가나요?
  @Post('lent')
  async postLent(
    @Body(new ValidationPipe())
    userInfoDto: UserInfoDto,
    cabinet_id: number,
  ) {
    // 특정 사물함을 빌릴 때 요청
    this.logger.log('postLent');
    let errno: number;
    const cabinetStatus = await this.cabinetService.checkCabinetStatus(
      cabinet_id,
    );
    if (userInfoDto && cabinetStatus) {
      const myLent = await this.cabinetService.getUser(userInfoDto);
      if (myLent.lent_id === -1) {
        const response = await this.lentService.createLent(
          cabinet_id,
          userInfoDto,
        );
        errno = response && response.errno === -1 ? -2 : cabinet_id;
        return { cabinet_id: errno };
      } else {
        return { cabinet_id: -1 };
      }
    } else {
      throw new BadRequestException({ cabinet_id: cabinet_id });
    }
  }

  //TODO: lentCabinetInfoDto 추가 필요
  @Post('return_info')
  async postReturnInfo(
    @Body(new ValidationPipe()) userInfoDto: UserInfoDto,
  ): Promise<lentCabinetInfoDto> {
    // 특정 사용자가 현재 대여하고 있는 사물함의 정보
    this.logger.log('postReturnInfo');
    return await this.cabinetService.getUser(userInfoDto);
  }

  /**
   * 특정 사물함을 반납할 때 요청
   * @param UserSessionDto
   * @return Promise<void>
   * FIXME: Lent Controller에 들어가는게 적절할 것 같습니다.
   * TODO: UserDto 추가 필요.
   * TODO: Lent Service에 createLentLog(): UserDto 필요.
   */
  @Post('return')
  @UseGuards(BanCheckGuard)
  async postReturn(@User() user: UserSessionDto): Promise<void> {
    return this.cabinetService.createLentLog(user.user_id, user.intra_id);
  }

  /**
   * 적절한 유저가 페이지를 접근하는지에 대한 정보
   * @param UserSessionDto
   * @return Promise<{ user: UserSessionDto }>
   * FIXME: Auth Controller에 들어가는게 더 적절할 것 같습니다.
   */
  @Post('check')
  @UseGuards(BanCheckGuard)
  async postCheck(@User() user: UserSessionDto): Promise<{ user: UserSessionDto }> {
    return await { user };
  }

  /**
   * 대여 연장 요청이 들어올 때 이를 처리하는 api
   * @param UserSessionDto
   * @return Promise<void>
   * FIXME: Lent Controller에 들어가는게 적절할 것 같습니다.
   * FIXME: 새 대여 정책에서 해당 연장 기능이 없어질 수 있음.
   * TODO: Lent Service에 activateExtension 포팅 필요.
   */
  @Post('extension')
  @UseGuards(BanCheckGuard)
  async postExtension(@User() user: UserSessionDto): Promise<void> {
    // 추후 lentService로 변경해야 함.
    return await this.cabinetService.activateExtension(user);
  }
}
