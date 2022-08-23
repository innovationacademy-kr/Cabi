import { BadRequestException, Controller, Logger, Post } from '@nestjs/common';
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

  @Post('return')
  async postReturn() {
    // 특정 사물함을 반납할 때 요청
    this.logger.log('postReturn');
  }

  @Post('check')
  async postCheck() {
    // 적절한 유저가 페이지를 접근하는지에 대한 정보
    this.logger.log('postCheck');
  }

  @Post('extension')
  async postExtension() {
    this.logger.log('postExtension');
  }
}
