import { BadRequestException, Controller, Logger, Post } from '@nestjs/common';
import { CabinetListDto } from './dto/cabinet-list.dto';
import { CabinetService } from './cabinet.service';
import { MyLentInfoDto } from './dto/my-lent-info.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api')
export class CabinetController {
  private logger = new Logger(CabinetController.name);

  constructor(private cabinetService: CabinetService) {}

  @ApiOperation({
    summary: '전체 사물함 정보 호출',
    description: '전체 사물함 정보를 가져옵니다.',
  })
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
  async postLentInfo(): Promise<MyLentInfoDto> {
    // 현재 모든 대여자들의 정보
    this.logger.log('postLentInfo');
    const userId = 12345; // TODO: 실제 유저 ID를 받아야 함.
    return this.cabinetService.getAllLentInfo(userId);
  }

  @ApiOperation({
    summary: '사물함 대여',
    description: '특정 사물함을 대여합니다.',
  })
  @Post('lent')
  async postLent() {
    // 특정 사물함을 빌릴 때 요청
    this.logger.log('postLent');
  }

  @ApiOperation({
    summary: '유저의 대여 중 사물함 정보',
    description: '특정 유저가 현재 대여하고 있는 사물함의 정보를 가져옵니다.',
  })
  @Post('return_info')
  async postReturnInfo() {
    // 특정 사용자가 현재 대여하고 있는 사물함의 정보
    this.logger.log('postReturnInfo');
  }

  @ApiOperation({
    summary: '사물함 반납',
    description: ' 특정 사물함을 반납을 처리합니다.',
  })
  @Post('return')
  async postReturn() {
    // 특정 사물함을 반납할 때 요청
    this.logger.log('postReturn');
  }

  @ApiOperation({
    summary: '페이지 접근 권한',
    description: '유저의 페이지 접근 권한 여부 정보를 리턴합니다.',
  })
  @Post('check')
  async postCheck() {
    // 적절한 유저가 페이지를 접근하는지에 대한 정보
    this.logger.log('postCheck');
  }

  @ApiOperation({
    summary: '사물함 연장',
    description: '특정 사물함의 대여기간을 연장합니다.',
  })
  @Post('extension')
  async postExtension() {
    this.logger.log('postExtension');
  }
}
