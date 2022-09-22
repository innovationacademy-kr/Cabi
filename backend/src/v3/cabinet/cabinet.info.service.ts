import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { LentInfoResponseDto } from 'src/dto/response/lent.info.response.dto';
import { SpaceDataResponseDto } from 'src/dto/response/space.data.response.dto';
import { SpaceDataDto } from 'src/dto/space.data.dto';
import { ICabinetInfoRepository } from './repository/cabinet.info.repository.interface';

@Injectable()
export class CabinetInfoService {
  constructor(
    @Inject('ICabinetInfoRepository')
    private cabinetInfoRepository: ICabinetInfoRepository,
  ) {}

  async getSpaceInfo(): Promise<SpaceDataResponseDto> {
    const location = '새롬관';
    const floors: number[] = [2, 4, 5];
    const space_data: SpaceDataDto[] = [{ location, floors }];

    return { space_data };
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

  async getCabinetInfo(cabinetId: number): Promise<CabinetInfoResponseDto> {
    try {
      return await this.cabinetInfoRepository.getCabinetInfo(cabinetId);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateCabinetActivation(cabinet_id: number, activation: number): Promise<void> {
    try {
      await this.cabinetInfoRepository.updateCabinetActivation(cabinet_id, activation);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
