import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiFoundResponse, ApiOperation } from '@nestjs/swagger';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { LentInfoResponseDto } from 'src/dto/response/lent.info.response.dto';
import { SpaceDataResponseDto } from 'src/dto/response/space.data.response.dto';
import { CabinetInfoService } from './cabinet.info.service';

@Controller({
  version: '3',
  path: 'api/cabinet_info',
})
export class CabinetController {
  private logger = new Logger(CabinetController.name);

  constructor(private cabinetService: CabinetInfoService) {}

  // TODO: AuthGuard 처리는 기능 구현을 해보고 추가할 지 말지 결정하는 걸로 하겠습니다.
  @ApiOperation({
    summary: 'space 정보 호출',
    description: 'cabi에 존재하는 건물/층 정보를 받아옵니다.',
  })
  @ApiFoundResponse({
    description: 'cabi에 존재하는 건물/층 정보를 SpaceDataResponseDto 형식으로 받아옵니다.',
  })
  @Get()
  async getSpaceInfo(): Promise<SpaceDataResponseDto> {
    this.logger.log('getSpaceInfo');
    const cabinetInfo = await this.cabinetService.getSpaceInfo();
    // TODO: SpaceDataResponseDto가 잘 가져와졌는지 확인하는 로직 추가 필요한지?
    return cabinetInfo;
  }

  @ApiOperation({
    summary: '층 정보 호출',
    description: 'cabi에 존재하는 건물/층 정보를 받아옵니다.',
  })
  @ApiFoundResponse({
    description: '정상적인 건물 정보와 층 정보가 들어오면 층에 존재하는 section 정보와 사물함 정보를 가져옵니다.',
  })
  @ApiBadRequestResponse({
    description: '비정상 파라미터',
  })
  @Get('/:location/:floor')
  async getCabinetsInfoByParam(
    @Param('location') location: string,
    @Param('floor', ParseIntPipe) floor: number,
  ): Promise<LentInfoResponseDto> {
    this.logger.log('getCabinetInfoByParam');
    return await this.cabinetService.getCabinetInfoByParam(location, floor);
  }

  @ApiOperation({
    summary: '사물함 정보 호출',
    description: 'cabinet_id를 받아 특정 사물함의 상세정보를 받아옵니다.',
  })
  @ApiFoundResponse({
    description: '파라미터로 받은 사물함의 정보를 CabinetInfoResponseDto 형식으로 받아옵니다'
  })
  @ApiBadRequestResponse({
    description: '비정상 파라미터',
  })
  @Get('/:cabinet_id')
  async getCabinetInfoById(
    @Param('cabinet_id', ParseIntPipe) cabinetId: number,
  ): Promise<CabinetInfoResponseDto> {
    this.logger.log('getCabinetInfoById');
    return await this.cabinetService.getCabinetResponseInfo(cabinetId);
  }
}
