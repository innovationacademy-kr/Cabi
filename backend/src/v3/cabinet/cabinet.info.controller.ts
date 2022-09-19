import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'space 정보 호출',
    description: 'cabi에 존재하는 건물/층 정보를 받아옵니다.',
  })
  @Get()
  async getSpaceInfo(): Promise<SpaceDataResponseDto> {
    this.logger.log('getCabinetInfo');
    const cabinetInfo = await this.cabinetService.getSpaceInfo();
    // TODO: SpaceDataResponseDto가 잘 가져와졌는지 확인하는 로직 추가 필요한지?
    return cabinetInfo;
  }

  @ApiOperation({
    summary: '층 정보 호출',
    description: 'cabi에 존재하는 건물/층 정보를 받아옵니다.',
  })
  @Get('/:location/:floor')
  async getCabinetsInfoByParam(
    @Param('location') location: string,
    @Param('floor', ParseIntPipe) floor: number,
  ): Promise<LentInfoResponseDto> {
    this.logger.log('getCabinetInfoByParam');
    return await this.cabinetService.getCabinetInfoByParam(location, floor);
  }

  @Get('/:cabinet_id')
  async getCabinetInfoById(
    @Param('cabinet_id', ParseIntPipe) cabinetId: number,
  ): Promise<CabinetInfoResponseDto> {
    this.logger.log('getCabinetInfoById');
    return await this.cabinetService.getCabinetInfo(cabinetId);
  }
}