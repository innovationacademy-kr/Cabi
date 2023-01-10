import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ICabinetInfoRepository } from 'src/cabinet/repository/cabinet.info.interface.repository';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';
import { CabinetFloorDto } from '../dto/cabinet.floor.dto';
import { ICabinetRepository } from './repository/cabinet.repository.interface';

@Injectable()
export class CabinetService {
  private logger = new Logger(CabinetService.name);

  constructor(
    @Inject('ICabinetRepository')
    private cabinetRepository: ICabinetRepository,
    @Inject('ICabinetInfoRepository')
    private cabinetInfoRepository: ICabinetInfoRepository,
  ) {}

  async getCabinetCountFloor(): Promise<CabinetFloorDto[]> {
    this.logger.debug('call getCabinetCountFloor');
    const result = await this.cabinetRepository.getCabinetCountFloor();
    return result;
  }

  async getCabinetIdBySection(
    location: string,
    floor: number,
    section: string,
  ): Promise<number[]> {
    this.logger.debug(`Called ${this.getCabinetIdBySection.name}`);
    return await this.cabinetRepository.getCabinetIdBySection(
      location,
      floor,
      section,
    );
  }

  async updateLentType(cabinetId: number, lentType: LentType): Promise<void> {
    this.logger.debug(
      `Called ${CabinetService.name} ${this.updateLentType.name}`,
    );
    const isLent = await this.cabinetRepository.cabinetIsLent(cabinetId);
    if (isLent === true) {
      throw new HttpException(
        '🚨 대여자가 있는 사물함입니다 🚨',
        HttpStatus.FORBIDDEN,
      );
    }
    if ((await this.isCabinetExist(cabinetId)) === false) {
      throw new HttpException(
        '🚨 존재하지 않는 사물함입니다 🚨',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.cabinetRepository.updateLentType(cabinetId, lentType);
  }

  async updateStatusNote(
    cabinetId: number,
    statusNote: string,
  ): Promise<void> {
    this.logger.debug(
      `Called ${CabinetService.name} ${this.updateStatusNote.name}`,
    );
    if ((await this.isCabinetExist(cabinetId)) === false) {
      throw new HttpException(
        '🚨 존재하지 않는 사물함입니다 🚨',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.cabinetRepository.updateStatusNote(cabinetId, statusNote);
  }

  async updateCabinetStatusByBundle(
    status: CabinetStatusType,
    bundle: number[],
  ): Promise<number[]> {
    this.logger.debug(
      `Called ${CabinetService.name} ${this.updateCabinetStatusByBundle.name}`,
    );
    const result = [];
    for (const cabinetId of bundle) {
      if ((await this.isCabinetExist(cabinetId)) === false) {
        result.push(cabinetId);
        continue;
      }
      try {
        await this.cabinetInfoRepository.updateCabinetStatus(cabinetId, status);
      } catch (e) {
        result.push(cabinetId);
        continue;
      }
    }
    return result;
  }

  async updateLentTypeByBundle(
    lentType: LentType,
    bundle: number[],
  ): Promise<number[]> {
    this.logger.debug(
      `Called ${CabinetService.name} ${this.updateCabinetStatusByBundle.name}`,
    );
    const result = [];
    for (const cabinetId of bundle) {
      const isLent = await this.cabinetRepository.cabinetIsLent(cabinetId);
      if (isLent === true) {
        result.push(cabinetId);
        continue;
      }
      if ((await this.isCabinetExist(cabinetId)) === false) {
        result.push(cabinetId);
        continue;
      }
      try {
        await this.cabinetRepository.updateLentType(cabinetId, lentType);
      } catch (e) {
        result.push(cabinetId);
        continue;
      }
    }
    return result;
  }

  async updateCabinetTitle(cabinet_id: number, title: string): Promise<void> {
    this.logger.debug(
      `Called ${CabinetService.name} ${this.updateCabinetTitle.name}`,
    );
    if ((await this.isCabinetExist(cabinet_id)) === false) {
      throw new HttpException(
        '🚨 존재하지 않는 사물함입니다 🚨',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.cabinetRepository.updateCabinetTitle(cabinet_id, title);
  }

  async isCabinetExist(cabinetId: number): Promise<boolean> {
    this.logger.debug(
      `Called ${CabinetService.name} ${this.isCabinetExist.name}`,
    );
    return await this.cabinetRepository.isCabinetExist(cabinetId);
  }
}
