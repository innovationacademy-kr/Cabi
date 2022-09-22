import { BadRequestException, ConflictException, Controller, ForbiddenException, Get, HttpException, HttpStatus, ImATeapotException, InternalServerErrorException, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
  async lentCabinet(@Param() cabinet_id: number): Promise<MyCabinetInfoResponseDto> {
    const user: UserSessionDto = {
      user_id: 80400,
      intra_id: 'hyospark',
      iat: 0,
      ext: 253402182000000,
    };
    try {
      return await this.lentService.lentCabinet(cabinet_id, user);
    } catch (err) {
      if (err.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(err.message);
      } else if (err.status === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException(err.message);
      } else if (err.status === HttpStatus.I_AM_A_TEAPOT) {
        throw new ImATeapotException(err.message);
      } else if (err.status === HttpStatus.CONFLICT) {
        throw new ConflictException(err.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Patch('/update_cabinet_title/:cabinet_title')
  // @UseGuards(JwtAuthGuard, BanCheckGuard)
  async updateLentCabinetTitle(@Param('cabinet_title') cabinet_title: string) {
    const user: UserSessionDto = {
      user_id: 85330,
      intra_id: 'sichoi',
      iat: 0,
      ext: 253402182000000,
    };
    try {
      return await this.lentService.updateLentCabinetTitle(cabinet_title, user);
    } catch (err) {
      if (err.status === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException(err.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Patch('/update_cabinet_memo/:cabinet_memo')
  // @UseGuards(JwtAuthGuard, BanCheckGuard)
  async updateLentCabinetMemo(@Param('cabinet_memo') cabinet_memo: string) {
    const user: UserSessionDto = {
      user_id: 85330,
      intra_id: 'sichoi',
      iat: 0,
      ext: 253402182000000,
    };
    try {
      return await this.lentService.updateLentCabinetMemo(cabinet_memo, user);
    } catch (err) {
      if (err.status === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException(err.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
