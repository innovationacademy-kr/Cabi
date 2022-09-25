import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  ImATeapotException,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { User } from 'src/auth/user.decorator';
import { BanCheckGuard } from 'src/ban/guard/ban-check.guard';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { LentService } from './lent.service';

@Controller({
  version: '3',
  path: '/api/lent',
})
export class LentController {
  private logger = new Logger(LentController.name);
  constructor(private lentService: LentService) {}

  @ApiOperation({
    summary: '특정 캐비넷 대여 시도',
    description: 'cabinet_id에 해당하는 캐비넷 대여를 시도합니다.',
  })
  @ApiCreatedResponse({
    description: '대여에 성공 시, 201 Created를 응답합니다.',
  })
  @ApiBadRequestResponse({
    description:
      '이미 대여중인 사물함이 있는 경우, 400 Bad_Request를 응답합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '임시 밴 사물함이나 고장 사물함을 대여 시도한 경우, 403 Forbidden을 응답합니다.',
  })
  @ApiResponse({
    status: HttpStatus.I_AM_A_TEAPOT,
    description:
      "동아리 사물함을 대여 시도한 경우, 418 I'm a teapot을 응답합니다.",
  })
  @ApiConflictResponse({
    description: '잔여 자리가 없는 경우, 409 Conflict를 응답합니다.',
  })
  @Post('/:cabinet_id')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async lentCabinet(
    @Param('cabinet_id') cabinet_id: number,
    @User() user: UserSessionDto,
  ): Promise<void> {
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

  @ApiOperation({
    summary: '캐비넷의 제목 업데이트',
    description: '자신이 대여한 캐비넷의 제목을 업데이트합니다.',
  })
  @ApiOkResponse({
    description: 'Patch 성공 시, 200 Ok를 응답합니다.',
  })
  @ApiBadRequestResponse({
    description:
      '대여하고 있지 않은 사물함의 제목을 업데이트 시도하면, 400 Bad_Request를 응답합니다.',
  })
  @Patch('/update_cabinet_title/:cabinet_title')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async updateLentCabinetTitle(
    @Param('cabinet_title') cabinet_title: string,
    @User() user: UserSessionDto,
  ): Promise<void> {
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

  @ApiOperation({
    summary: '캐비넷의 메모 업데이트',
    description: '자신이 대여한 캐비넷의 메모를 업데이트합니다.',
  })
  @ApiOkResponse({
    description: 'Patch 성공 시, 200 Ok를 응답합니다.',
  })
  @ApiBadRequestResponse({
    description:
      '대여하고 있지 않은 사물함의 메모를 업데이트 시도하면, 400 Bad_Request를 응답합니다.',
  })
  @Patch('/update_cabinet_memo/:cabinet_memo')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, BanCheckGuard)
  async updateLentCabinetMemo(
    @Param('cabinet_memo') cabinet_memo: string,
    @User() user: UserSessionDto,
  ): Promise<void> {
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

  @ApiOperation({
    summary: '대여한 사물함을 반납',
    description: '자신이 대여한 캐비넷을 반납합니다.',
  })
  @ApiNoContentResponse({
    description: 'Delete 성공 시, 204 No_Content를 응답합니다.',
  })
  @ApiBadRequestResponse({
    description:
      '대여하고 있지 않은 사물함을 반납 시도하면, 400 Bad_Request를 응답합니다.',
  })
  @Delete('/return')
  @HttpCode(HttpStatus.NO_CONTENT)
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
