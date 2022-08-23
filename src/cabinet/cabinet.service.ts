import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CabinetListDto } from './dto/cabinet-list.dto';
import { ICabinetRepository } from './repository/cabinet.repository';
import { MyLentInfoDto } from './dto/my-lent-info.dto';

@Injectable()
export class CabinetService {
  constructor(private cabinetRepository: ICabinetRepository) {}

  /**
   * 전체 사물함에 대한 정보를 가져옵니다.
   */
  async getAllCabinets(): Promise<CabinetListDto> {
    try {
      return this.cabinetRepository.getAllCabinets();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllLentInfo(userId: number): Promise<MyLentInfoDto> {
    try {
      const lentInfo = await this.cabinetRepository.getLentUsers();
      const isLent = lentInfo.findIndex(
        (cabinet) => cabinet.lent_user_id === userId,
      );
      return {
        lentInfo,
        isLent,
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
