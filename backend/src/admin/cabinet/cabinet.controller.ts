import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';
import { JwtAuthGuard } from '../auth/jwt/guard/jwtauth.guard';
import { CabinetFloorDto } from '../dto/cabinet.floor.dto';
import { CabinetInfoResponseDto } from '../dto/cabinet.info.response.dto';
import { CabinetStatusNoteRequestDto } from '../dto/cabinet.status.note.request.dto';
import { CabinetTitleRequestDto } from '../dto/cabinet.title.request.dto';
import { CabinetService } from './cabinet.service';

@ApiTags('(Admin) Cabinet')
@ApiBearerAuth()
@Controller('/api/admin/cabinet')
@UseGuards(JwtAuthGuard)
export class CabinetController {
  constructor(
    private adminCabinetService: CabinetService,
    private cabinetInfoService: CabinetInfoService,
    ) {}
  private logger = new Logger(CabinetController.name);

  @ApiOperation({
    summary: '각 층의 사물함 정보',
    description: '각 층에 있는 사물함의 상태별 개수 정보를 반환합니다.'
  })
  @ApiOkResponse({
    type: CabinetFloorDto,
    description: '각 층의 사물함의 상태별로 개수를 세어 CabinetFloorDto 형식으로 반환합니다'
  })
  @Get('/count/floor')
  @ApiOperation({})
  async getCabinetCountEachFloor(): Promise<CabinetFloorDto[]> {
    this.logger.debug(`Called ${this.getCabinetCountEachFloor.name}`);
    return await this.adminCabinetService.getCabinetCountFloor();
  }

  @ApiOperation({
    summary: '사물함 정보 호출',
    description: 'cabinet_id를 받아 특정 사물함의 상세정보를 받아옵니다.',
  })
  @ApiOkResponse({
    type: CabinetInfoResponseDto,
    description:
      '파라미터로 받은 사물함의 정보를 CabinetInfoResponseDto 형식으로 받아옵니다',
  })
  @ApiBadRequestResponse({
    description: '비정상 파라미터',
  })
  @Get('/:cabinetId')
  async getCabinetInfoByCabinetId(
    @Param('cabinetId', ParseIntPipe) cabinetId: number,
  ): Promise<CabinetInfoResponseDto> {
    this.logger.debug(`Called ${this.getCabinetInfoByCabinetId.name}`);
    return await this.cabinetInfoService.getCabinetResponseInfo(cabinetId);
  }

  @ApiOperation({
    summary: '사물함 상태 변경',
    description: 'cabinet_id를 받아 사물함의 상태를 변경합니다.',
  })
  @ApiNoContentResponse({
    description: '성공',
  })
  @ApiBadRequestResponse({
    description: '비정상 상태 및 cabinet_id',
  })
  @Patch('/status/:cabinetId/:status')
  async updateCabinetStatusByCabinetId(
    @Param('cabinetId') cabinetId: number,
    @Param('status') status: CabinetStatusType,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetStatusByCabinetId.name}`);
    await this.cabinetInfoService.updateCabinetStatus(cabinetId, status);
  }

  @ApiOperation({
    summary: '사물함 lent_type 변경',
    description: 'cabinet_id를 받아 사물함의 lent_type을 변경합니다.',
  })
  @ApiNoContentResponse({
    description: '성공',
  })
  @ApiBadRequestResponse({
    description: '비정상 lent_type 및 cabinet_id',
  })
  @ApiForbiddenResponse({
    description: '대여 중인 캐비넷',
  })
  @Patch('/lentType/:cabinetId/:lentType')
  async updateCabinetLentTypeByCabinetId(
    @Param('cabinetId') cabinetId: number,
    @Param('lentType') lentType: LentType,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetLentTypeByCabinetId.name}`);
    await this.adminCabinetService.updateLentType(cabinetId, lentType);
  }

  @ApiOperation({
    summary: '사물함 고장 사유 변경',
    description: 'cabinet_id를 받아 사물함의 고장 사유를 변경합니다.',
  })
  @ApiNoContentResponse({
    description: '성공',
  })
  @ApiBadRequestResponse({
    description: '존재하지 않는 cabinet_id',
  })
  @Patch('/statusNote/:cabinetId')
  async updateCabinetStatusNoteByCabinetId(
    @Param('cabinetId', ParseIntPipe) cabinetId: number,
    @Body(new ValidationPipe()) statusNote: CabinetStatusNoteRequestDto,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetStatusNoteByCabinetId.name}`);
    await this.adminCabinetService.updateStatusNote(cabinetId, statusNote.status_note)
  }

  @ApiOperation({
    summary: '특정 사물함들의 상태 변경',
    description: 'cabinet_id 배열을 받아 사물함들의 상태를 변경합니다.',
  })
  @ApiNoContentResponse({
    description: '성공',
  })
  @ApiBadRequestResponse({
    description: '비정상 상태 및 cabinet_id',
  })
  @Patch('/bundle/status/:status')
  async updateCabinetBundleStatus(
    @Param('status', new ParseEnumPipe(CabinetStatusType))
    status: CabinetStatusType,
    @Body() bundle: number[],
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetBundleStatus.name}`);
    const fail = await this.adminCabinetService.updateCabinetStatusByBundle(
      status,
      bundle,
    );
    if (fail.length !== 0) {
      throw new HttpException(fail, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: '특정 사물함들의 lent_type 변경',
    description: 'cabinet_id 배열을 받아 사물함들의 lent_type을 변경합니다.',
  })
  @ApiNoContentResponse({
    description: '성공',
  })
  @ApiBadRequestResponse({
    description: '비정상 lent_type 및 cabinet_id',
  })
  @ApiForbiddenResponse({
    description: '대여 중인 캐비넷',
  })
  @Patch('/bundle/lentType/:lentType')
  async updateCabinetBundleLentType(
    @Param('lentType', new ParseEnumPipe(LentType)) lentType: LentType,
    @Body() bundle: number[],
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetBundleLentType.name}`);
    const fail = await this.adminCabinetService.updateLentTypeByBundle(
      lentType,
      bundle,
    );
    if (fail.length !== 0) {
      throw new HttpException(fail, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: '사물함 title 변경',
    description: 'cabinet_id를 받아 사물함의 title을 변경합니다.',
  })
  @ApiNoContentResponse({
    description: '성공',
  })
  @ApiBadRequestResponse({
    description: '존재하지 않는 cabinet_id',
  })
  @Patch('/:cabinetId/:title')
  async updateCabinetTitleByCabinetId(
    @Param('cabinetId', ParseIntPipe) cabinetId: number,
    @Param('title') title: string,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateCabinetTitleByCabinetId.name}`);
    await this.adminCabinetService.updateCabinetTitle(cabinetId, title);
  }
}
