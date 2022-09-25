import { BadRequestException, ConflictException, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, ImATeapotException, InternalServerErrorException, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async lentCabinet(
    @Param('cabinet_id') cabinet_id: number, @User() user: UserSessionDto): Promise<MyCabinetInfoResponseDto> {
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
        this.logger.error(err);
        throw new InternalServerErrorException();
      }
    }
  }

  @Patch('/update_cabinet_title/:cabinet_title')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async updateLentCabinetTitle(@Param('cabinet_title') cabinet_title: string, @User() user: UserSessionDto): Promise<void> {
    try {
      return await this.lentService.updateLentCabinetTitle(cabinet_title, user);
    } catch (err) {
      if (err.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(err.message);
      } else {
        this.logger.error(err);
        throw new InternalServerErrorException();
      }
    }
  }

  @Patch('/update_cabinet_memo/:cabinet_memo')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async updateLentCabinetMemo(@Param('cabinet_memo') cabinet_memo: string, @User() user: UserSessionDto): Promise<void> {
    try {
      return await this.lentService.updateLentCabinetMemo(cabinet_memo, user);
    } catch (err) {
      if (err.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(err.message);
      } else {
        this.logger.error(err);
        throw new InternalServerErrorException();
      }
    }
  }

  @Delete('/return')
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async returnLentCabinet(@User() user: UserSessionDto): Promise<void> {
    try {
      return await this.lentService.returnLentCabinet(user);
    } catch (err) {
      if (err.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(err.message);
      } else {
        this.logger.error(err);
        throw new InternalServerErrorException();
      }
    }
  }
}
