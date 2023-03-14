import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ICabinetInfoRepository } from 'src/cabinet/repository/cabinet.info.interface.repository';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';
import { CabinetFloorDto } from '../dto/cabinet.floor.dto';
import { IAdminCabinetRepository } from './repository/cabinet.repository.interface';

@Injectable()
export class AdminCabinetService {
  private logger = new Logger(AdminCabinetService.name);

  constructor(
    @Inject('IAdminCabinetRepository')
    private adminCabinetRepository: IAdminCabinetRepository,
    @Inject('ICabinetInfoRepository')
    private cabinetInfoRepository: ICabinetInfoRepository,
  ) {}

  async throwIfHasBorrower(cabinetId: number) {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.throwIfHasBorrower.name}`,
    );
    if ((await this.adminCabinetRepository.cabinetIsLent(cabinetId)) === true) {
      throw new HttpException(
        '대여자가 있는 사물함입니다',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async throwIfNotExistedCabinet(cabinetId: number) {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.throwIfNotExistedCabinet.name}`,
    );
    if ((await this.isCabinetExist(cabinetId)) === false) {
      throw new HttpException(
        '존재하지 않는 사물함입니다',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getCabinetCountFloor(): Promise<CabinetFloorDto[]> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.getCabinetCountFloor.name}`,
    );
    const result = await this.adminCabinetRepository.getCabinetCountFloor();
    return result;
  }

  async getCabinetIdBySection(
    location: string,
    floor: number,
    section: string,
  ): Promise<number[]> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.getCabinetIdBySection.name}`,
    );
    return await this.adminCabinetRepository.getCabinetIdBySection(
      location,
      floor,
      section,
    );
  }

  async updateLentType(cabinetId: number, lentType: LentType): Promise<void> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.updateLentType.name}`,
    );
    await this.throwIfNotExistedCabinet(cabinetId);
    await this.throwIfHasBorrower(cabinetId);
	if (lentType == LentType.PRIVATE)
		await this.adminCabinetRepository.updateCabinetMaxUser(cabinetId, 1);
	if (lentType == LentType.SHARE)
		await this.adminCabinetRepository.updateCabinetMaxUser(cabinetId, 3);
	if (lentType == LentType.CLUB)
		await this.adminCabinetRepository.updateCabinetMaxUser(cabinetId, 1);
    await this.adminCabinetRepository.updateLentType(cabinetId, lentType);
  }

  async updateStatusNote(cabinetId: number, statusNote: string): Promise<void> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.updateStatusNote.name}`,
    );
    await this.throwIfNotExistedCabinet(cabinetId);
    await this.adminCabinetRepository.updateStatusNote(cabinetId, statusNote);
  }

  async updateCabinetStatusByBundle(
    status: CabinetStatusType,
    bundle: number[],
  ): Promise<number[]> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.updateCabinetStatusByBundle.name}`,
    );
    const result = [];
    for (const cabinetId of bundle) {
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
      `Called ${AdminCabinetService.name} ${this.updateCabinetStatusByBundle.name}`,
    );
    const result = [];
    for (const cabinetId of bundle) {
      try {
        await this.updateLentType(cabinetId, lentType);
      } catch (e) {
        result.push(cabinetId);
        continue;
      }
    }
    return result;
  }

  async updateCabinetTitle(cabinetId: number, title: string): Promise<void> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.updateCabinetTitle.name}`,
    );
    await this.throwIfNotExistedCabinet(cabinetId);
    await this.adminCabinetRepository.updateCabinetTitle(cabinetId, title);
  }

  async updateCabinetStatus(
    cabinetId: number,
    status: CabinetStatusType,
  ): Promise<void> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.updateCabinetStatus.name}`,
    );
    await this.throwIfNotExistedCabinet(cabinetId);
    if (status === CabinetStatusType.BROKEN)
      await this.throwIfHasBorrower(cabinetId);
    await this.adminCabinetRepository.updateCabinetStatus(cabinetId, status);
  }

  async updateCabinetMaxUser(
    cabinetId: number,
	maxUser: number,
  ): Promise<void> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.updateCabinetMaxUser.name}`,
    );
    await this.throwIfNotExistedCabinet(cabinetId);
    await this.adminCabinetRepository.updateCabinetMaxUser(cabinetId, maxUser);
  }

  async isCabinetExist(cabinetId: number): Promise<boolean> {
    this.logger.debug(
      `Called ${AdminCabinetService.name} ${this.isCabinetExist.name}`,
    );
    return await this.adminCabinetRepository.isCabinetExist(cabinetId);
  }
}
