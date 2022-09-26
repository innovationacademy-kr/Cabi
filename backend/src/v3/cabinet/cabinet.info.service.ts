import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { LentInfoResponseDto } from 'src/dto/response/lent.info.response.dto';
import { SpaceDataResponseDto } from 'src/dto/response/space.data.response.dto';
import { SpaceDataDto } from 'src/dto/space.data.dto';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { ICabinetInfoRepository } from './repository/interface.cabinet.info.repository';

@Injectable()
export class CabinetInfoService {
  constructor(
    @Inject('ICabinetInfoRepository')
    private cabinetInfoRepository: ICabinetInfoRepository,
  ) {}

  async getSpaceInfo(): Promise<SpaceDataResponseDto> {
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
  ): Promise<LentInfoResponseDto> {
    try {
      return this.cabinetInfoRepository.getFloorInfo(location, floor);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getCabinetResponseInfo(
    cabinetId: number,
  ): Promise<CabinetInfoResponseDto> {
    try {
      return await this.cabinetInfoRepository.getCabinetResponseInfo(cabinetId);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getCabinetInfo(cabinetId: number): Promise<CabinetDto> {
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
    try {
      await this.cabinetInfoRepository.updateCabinetStatus(
        cabinet_id,
        status,
      );
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
