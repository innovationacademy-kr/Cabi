import { BadRequestException, Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { CabinetListDto } from './dto/cabinet-list.dto';
import { CabinetService } from './cabinet.service';
import { MyLentInfoDto } from './dto/my-lent-info.dto';

@Controller('api')
export class CabinetController {
  private logger = new Logger(CabinetController.name);

  constructor(private cabinetService: CabinetService) {}

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

  @Post('lent')
  async postLent() {
    // 특정 사물함을 빌릴 때 요청
    this.logger.log('postLent');
  }

  @Post('return_info')
  async postReturnInfo() {
    // 특정 사용자가 현재 대여하고 있는 사물함의 정보
    this.logger.log('postReturnInfo');
  }

  /**
   * 특정 사물함을 반납할 때 요청
   * @param UserInfoDto
   * @return Promise<void>
   * FIXME: Lent Controller에 들어가는게 적절할 것 같습니다.
   * TODO: UserDto 추가 필요.
   * TODO: Lent Service에 createLentLog(): UserDto 필요.
   */
  @Post('return')
  async postReturn(
    @Body(new ValidationPipe()) userInfoDto: UserInfoDto
  ): Promise<void> {
    await this.authService.loginBanCheck(userInfoDto)
    .catch(new Error('LoginBanCheckError'));

    let userDto: UserDto = new UserDto();
    userDto.user_id = userInfoDto.user_id;
    userDto.intra_id = userInfoDto.intra_id;
    return this.lentService.createLentLog(userDto);
  }

  /**
   * 적절한 유저가 페이지를 접근하는지에 대한 정보
   * @param UserInfoDto
   * @return Promise<UserInfoDto>
   * FIXME: Auth Controller에 들어가는게 더 적절할 것 같습니다.
   * TODO: UseGuards 추가 필요.
   * TODO: Auth Service에 loginBanCheck 포팅 필요.
   */
  @Post('check')
  async postCheck(
    @Body(new ValidationPipe()) userInfoDto: UserInfoDto
    ): Promise<UserInfoDto> {
    return await this.authService.loginBanCheck(userInfoDto);
  }

  /**
   * 대여 연장 요청이 들어올 때 이를 처리하는 api
   * @param UserInfoDto
   * @return Promise<void>
   * FIXME: Lent Controller에 들어가는게 적절할 것 같습니다.
   * FIXME: 새 대여 정책에서 해당 연장 기능이 없어질 수 있음.
   * TODO: UseGuards 추가 필요.
   * TODO: Lent Service에 activateExtension 포팅 필요.
   */
  @Post('extension')
  async postExtension(
    @Body(new ValidationPipe()) userInfoDto: UserInfoDto
  ): Promise<void> {
    await this.authService.loginBanCheck(userInfoDto)
    .catch(new Error('LoginBanCheckError'));

    return await this.lentService.activateExtension(userInfoDto);
  }
}
