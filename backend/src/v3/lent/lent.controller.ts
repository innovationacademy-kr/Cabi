import { Controller, ForbiddenException, Get, HttpException, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { User } from 'src/auth/user.decorator';
import { BanCheckGuard } from 'src/ban/guard/ban-check.guard';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { LentService } from './lent.service';

@Controller({
  version: '3',
  path: '/api/lent',
})
export class LentController {
  private logger = new Logger(LentController.name);
  constructor(private lentService: LentService) {}

  @Post('/:cabinet_id')
  // @UseGuards(JwtAuthGuard, BanCheckGuard) // TODO: 연체자가 대여를 시도하면 프론트 단에서 경고 메시지를 띄우는 것도 좋을 것 같습니다.
  async lentCabinet(@Param() cabinet_id: number, @User() user: UserSessionDto): Promise<MyCabinetInfoResponseDto> {
    try {
      return await this.lentService.lentCabinet(cabinet_id, user);
    } catch (err) {
      if (err.status === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException(` already lent cabinet!`);
      }
    }
  }
}
