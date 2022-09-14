import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CabinetListDto } from './dto/cabinet.list.dto';
import { ICabinetRepository } from './repository/cabinet.repository';
import { MyLentInfoDto } from './dto/my.lent.info.dto';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { LentCabinetInfoDto } from './dto/cabinet.lent.info.dto';
import { UserDto } from 'src/user/dto/user.dto';

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

  async lentCabinet(
    user: UserSessionDto,
    cabinet_id: number,
  ): Promise<{ cabinet_id: number }> {
    try {
      let errno: number;
      const cabinetStatus = await this.cabinetRepository.checkCabinetStatus(
        cabinet_id,
      );
      if (user && cabinetStatus) {
        const myLent = await this.getUserLentInfo(user);
        if (myLent.lent_id === -1) {
          const response = await this.cabinetRepository.createLent(
            cabinet_id,
            user,
          );
          errno = response && response.errno === -1 ? -2 : cabinet_id;
          return { cabinet_id: errno };
        } else {
          return { cabinet_id: -1 };
        }
      }
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getUserLentInfo(user: UserDto): Promise<LentCabinetInfoDto> {
    try {
      return await this.cabinetRepository.getUserLentInfo(user.user_id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  //lent_log 값 생성 후 lent 값 삭제
  async createLentLog(user: UserDto): Promise<number> {
    try {
      return await this.cabinetRepository.createLentLog(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async activateExtension(user: UserSessionDto): Promise<void> {
    try {
      await this.cabinetRepository.activateExtension(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateActivationToBan(cabinet_id: number): Promise<void> {
    try {
      await this.cabinetRepository.updateActivationToBan(cabinet_id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
