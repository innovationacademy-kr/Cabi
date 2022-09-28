import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { CabinetsPerSectionResponseDto } from 'src/dto/response/cabinet.per.section.response.dto';
import { SpaceDataResponseDto } from 'src/dto/response/space.data.response.dto';
import { SpaceDataDto } from 'src/dto/space.data.dto';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { ICabinetInfoRepository } from './repository/interface.cabinet.info.repository';

@Injectable()
export class CabinetInfoService {
  private logger = new Logger(CabinetInfoService.name);
  constructor(
    @Inject('ICabinetInfoRepository')
    private cabinetInfoRepository: ICabinetInfoRepository,
  ) {}

  async getSpaceInfo(): Promise<SpaceDataResponseDto> {
    this.logger.debug(`Called ${CabinetInfoService.name} ${this.getSpaceInfo.name}`);
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
    this.logger.debug(`Called ${CabinetInfoService.name} ${this.getCabinetInfoByParam.name}`);
    const cabinetInfo = await this.cabinetInfoRepository.getFloorInfo(
      location,
      floor,
    );
    if (cabinetInfo.length === 0) {
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
    return cabinetInfo;
  }

  async getCabinetResponseInfo(
    cabinetId: number,
  ): Promise<CabinetInfoResponseDto> {
    this.logger.debug(`Called ${CabinetInfoService.name} ${this.getCabinetResponseInfo.name}`);
    try {
      return await this.cabinetInfoRepository.getCabinetResponseInfo(cabinetId);
    } catch (e) {
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async getCabinetInfo(cabinetId: number): Promise<CabinetDto> {
    this.logger.debug(`Called ${CabinetInfoService.name} ${this.getCabinetInfo.name}`);
    try {
      return await this.cabinetInfoRepository.getCabinetInfo(cabinetId);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateCabinetStatus(
    cabinet_id: number,
    status: CabinetStatusType,
  ): Promise<void> {
    this.logger.debug(`Called ${CabinetInfoService.name} ${this.updateCabinetStatus.name}`);
    try {
      await this.cabinetInfoRepository.updateCabinetStatus(cabinet_id, status);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
