import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { User } from 'src/decorator/user.decorator';
import { UpdateCabinetMemoRequestDto } from 'src/dto/request/update.cabinet.memo.request.dto';
import { UpdateCabinetTitleRequestDto } from 'src/dto/request/update.cabinet.title.request.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { DataSource, QueryFailedError } from 'typeorm';
import { BanCheckGuard } from '../ban/guard/ban-check.guard';
import { LentService } from './lent.service';

@ApiTags('Lent')
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
      '임시 밴 사물함이나 연체 사물함 혹은 고장 사물함을 대여 시도한 경우, 403 Forbidden을 응답합니다.',
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
      this.logger.debug(`Called ${this.lentCabinet.name}`);
      return await this.lentService.lentCabinet(cabinet_id, user);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) {
        throw err;
      } else if (err instanceof QueryFailedError) {
        throw new InternalServerErrorException('다시 한번 요청해주세요.');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  @ApiOperation({
    summary: '캐비넷의 제목 업데이트',
    description: '자신이 대여한 캐비넷의 제목을 업데이트합니다.',
  })
  @ApiBody({ type: UpdateCabinetTitleRequestDto })
  @ApiOkResponse({
    description: 'Patch 성공 시, 200 Ok를 응답합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '사물함을 빌리지 않았는데 호출할 때, 403 Forbidden을 응답합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그아웃 상태거나 밴 된 사용자거나 JWT 세션이 만료됨',
  })
  @Patch('/update_cabinet_title')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateLentCabinetTitle(
    @Body(new ValidationPipe())
    updateCabinetTitleRequestDto: UpdateCabinetTitleRequestDto,
    @User() user: UserSessionDto,
  ): Promise<void> {
    try {
      this.logger.debug(`Called ${this.updateLentCabinetTitle.name}`);
      return await this.lentService.updateLentCabinetTitle(
        updateCabinetTitleRequestDto.cabinet_title,
        user,
      );
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalServerErrorException(
          `🚨 Cabi 내부 서버 에러가 발생했습니다 🥲 🚨`,
        );
      }
    }
  }

  @ApiOperation({
    summary: '캐비넷의 메모 업데이트',
    description: '자신이 대여한 캐비넷의 메모를 업데이트합니다.',
  })
  @ApiBody({ type: UpdateCabinetMemoRequestDto })
  @ApiOkResponse({
    description: 'Patch 성공 시, 200 Ok를 응답합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '사물함을 빌리지 않았는데 호출할 때, 403 Forbidden을 응답합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그아웃 상태거나 밴 된 사용자거나 JWT 세션이 만료됨',
  })
  @Patch('/update_cabinet_memo')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateLentCabinetMemo(
    @Body(new ValidationPipe())
    updateCabinetMemoRequestDto: UpdateCabinetMemoRequestDto,
    @User() user: UserSessionDto,
  ): Promise<void> {
    try {
      this.logger.debug(`Called ${this.updateLentCabinetMemo.name}`);
      return await this.lentService.updateLentCabinetMemo(
        updateCabinetMemoRequestDto.cabinet_memo,
        user,
      );
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalServerErrorException(
          `🚨 Cabi 내부 서버 에러가 발생했습니다 🥲 🚨`,
        );
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
  @ApiForbiddenResponse({
    description:
      '사물함을 빌리지 않았는데 호출할 때, 403 Forbidden을 응답합니다.',
  })
  @Delete('/return')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async returnCabinet(@User() user: UserSessionDto): Promise<void> {
    try {
      this.logger.debug(`Called ${this.returnCabinet.name}`);
      return await this.lentService.returnCabinet(user);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalServerErrorException(
          `🚨 Cabi 내부 서버 에러가 발생했습니다 🥲 🚨`,
        );
      }
    }
  }
}
