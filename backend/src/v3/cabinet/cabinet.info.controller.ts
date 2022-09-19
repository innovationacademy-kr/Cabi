import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { LentInfoResponseDto } from 'src/dto/response/lent.info.response.dto';
import { SpaceDataResponseDto } from 'src/dto/response/space.data.response.dto';
import { CabinetService } from './cabinet.info.service';

@Controller({
  version: '3',
  path: 'api/cabinet_info',
})
export class CabinetController {
  private logger = new Logger(CabinetController.name);

  constructor(private cabinetService: CabinetService) {}

  // TODO: AuthGuard 처리는 기능 구현을 해보고 추가할 지 말지 결정하는 걸로 하겠습니다.
  @Get()
  async getCabinetInfo(): Promise<SpaceDataResponseDto> {
    this.logger.log('getCabinetInfo');
    const cabinetInfo = await this.cabinetService.getSpaceData();
    // TODO: SpaceDataResponseDto가 잘 가져와졌는지 확인하는 로직 추가 필요한지?
    return cabinetInfo;
  }

  @Get('/:location/:floor')
  async getCabinetInfoByParam(
    @Param('location') locationInfo: string,
    @Param('floor') floorInfo: string,
  ): Promise<CabinetInfoResponseDto> {
    this.logger.log('getCabinetInfoByParam');
    return await this.cabinetService.getCabinetInfoByFloor(locationInfo, floorInfo);
  }

  @Get('/:cabinet_id')
  @UseGuards(JwtAuthGuard)
  async getCabinetInfoById(
    @Param('cabinet_id') cabinetId: string,
  ): Promise<LentInfoResponseDto> {
    this.logger.log('getCabinetInfoById');
    return await this.cabinetService.getCabinetInfo(cabinetId);
  }
}