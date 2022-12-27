import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { LentDto } from 'src/dto/lent.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { CabinetsPerSectionResponseDto } from 'src/dto/response/cabinet.per.section.response.dto';
import { SpaceDataResponseDto } from 'src/dto/response/space.data.response.dto';
import { SpaceDataDto } from 'src/dto/space.data.dto';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import {
  IsolationLevel,
  Propagation,
  Transactional,
} from 'typeorm-transactional';
import { ICabinetInfoRepository } from './repository/cabinet.info.interface.repository';

@Injectable()
export class CabinetInfoService {
  private logger = new Logger(CabinetInfoService.name);
  constructor(
    @Inject('ICabinetInfoRepository')
    private cabinetInfoRepository: ICabinetInfoRepository,
  ) {}

  async getSpaceInfo(): Promise<SpaceDataResponseDto> {
    this.logger.debug(
      `Called ${CabinetInfoService.name} ${this.getSpaceInfo.name}`,
    );
    const spaceData: SpaceDataDto[] = [];
    const location = await this.cabinetInfoRepository.getLocation();
    for (const l of location) {
      const floors = await this.cabinetInfoRepository.getFloors(l);
      spaceData.push({
        location: l,
        floors,
      });
    }
    return { space_data: spaceData };
  }

  async getCabinetInfoByParam(
    location: string,
    floor: number,
  ): Promise<CabinetsPerSectionResponseDto[]> {
    this.logger.debug(
      `Called ${CabinetInfoService.name} ${this.getCabinetInfoByParam.name}`,
    );
    const cabinetInfo = await this.cabinetInfoRepository.getFloorInfo(
      location,
      floor,
    );
    if (cabinetInfo.length === 0) {
      throw new HttpException(
        '🚨 존재하지 않는 사물함 영역입니다 🚨',
        HttpStatus.BAD_REQUEST,
      );
    }
    return cabinetInfo;
  }

  async getCabinetResponseInfo(
    cabinetId: number,
  ): Promise<CabinetInfoResponseDto> {
    this.logger.debug(
      `Called ${CabinetInfoService.name} ${this.getCabinetResponseInfo.name}`,
    );
    try {
      return await this.cabinetInfoRepository.getCabinetResponseInfo(cabinetId);
    } catch (e) {
      throw new HttpException(
        '🚨 존재하지 않는 사물함입니다 🚨',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getCabinetInfo(cabinetId: number): Promise<CabinetDto> {
    this.logger.debug(
      `Called ${CabinetInfoService.name} ${this.getCabinetInfo.name}`,
    );
    return await this.cabinetInfoRepository.getCabinetInfo(cabinetId);
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.REPEATABLE_READ,
  })
  async updateCabinetStatus(
    cabinet_id: number,
    status: CabinetStatusType,
  ): Promise<void> {
    this.logger.debug(
      `Called ${CabinetInfoService.name} ${this.updateCabinetStatus.name}`,
    );
    await this.cabinetInfoRepository.updateCabinetStatus(cabinet_id, status);
  }

  async getLentUsers(cabinet_id: number): Promise<LentDto[]> {
    this.logger.debug(
      `Called ${CabinetInfoService.name} ${this.getLentUsers.name}`,
    );
    return await this.cabinetInfoRepository.getLentUsers(cabinet_id);
  }
}
