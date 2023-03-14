import { CabinetFloorDto } from '../../dto/cabinet.floor.dto';
import { Repository } from 'typeorm';
import { IAdminCabinetRepository } from './cabinet.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import Cabinet from 'src/entities/cabinet.entity';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';

export class AdminCabinetRepository implements IAdminCabinetRepository {
  constructor(
    @InjectRepository(Cabinet)
    private cabinetRepository: Repository<Cabinet>,
  ) {}

  async getCabinetCountFloor(): Promise<CabinetFloorDto[]> {
    const result = await this.cabinetRepository
      .createQueryBuilder(this.getCabinetCountFloor.name)
      .select('floor')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        `COUNT(CASE WHEN cabinet_status='${CabinetStatusType.SET_EXPIRE_FULL}' THEN 1 END)`,
        'used',
      )
      .addSelect(
        `COUNT(CASE WHEN cabinet_status='${CabinetStatusType.EXPIRED}' THEN 1 END)`,
        'overdue',
      )
      .addSelect(
        `COUNT(CASE WHEN cabinet_status='${CabinetStatusType.AVAILABLE}' or
                                cabinet_status='${CabinetStatusType.SET_EXPIRE_AVAILABLE}' THEN 1 END)`,
        'unused',
      )
      .addSelect(
        `COUNT(CASE WHEN cabinet_status='${CabinetStatusType.BROKEN}' or cabinet_status='${CabinetStatusType.BANNED}' THEN 1 END)`,
        'disabled',
      )
      .groupBy('floor')
      .getRawMany();
    result.map((item) => {
      item.total = Number(item.total);
      item.used = Number(item.used);
      item.overdue = Number(item.overdue);
      item.unused = Number(item.unused);
      item.disabled = Number(item.disabled);
    });
    return result;
  }

  async getCabinetIdBySection(
    location: string,
    floor: number,
    section: string,
  ): Promise<number[]> {
    const result = await this.cabinetRepository
      .createQueryBuilder('c')
      .innerJoin('c.lent', 'lent')
      .select('lent_cabinet_id')
      .where({ location })
      .andWhere({ floor })
      .andWhere({ section })
      .getRawMany();

    return result.map((c) => c.lent_cabinet_id);
  }

  async updateLentType(cabinetId: number, lentType: LentType): Promise<void> {
    await this.cabinetRepository
      .createQueryBuilder(this.updateLentType.name)
      .update()
      .set({
        lent_type: lentType,
      })
      .where({
        cabinet_id: cabinetId,
      })
      .execute();
  }

  async cabinetIsLent(cabinetId: number): Promise<boolean> {
    const result = await this.cabinetRepository.findOne({
      relations: {
        lent: true,
      },
      where: {
        cabinet_id: cabinetId,
      },
    });
    if (result === null) {
      return false;
    }
    return result.lent.length === 0 ? false : true;
  }

  async updateStatusNote(cabinetId: number, statusNote: string): Promise<void> {
    await this.cabinetRepository
      .createQueryBuilder(this.updateLentType.name)
      .update()
      .set({
        status_note: statusNote,
      })
      .where({
        cabinet_id: cabinetId,
      })
      .execute();
  }

  async updateCabinetTitle(cabinetId: number, title: string): Promise<void> {
    await this.cabinetRepository
      .createQueryBuilder(this.updateCabinetTitle.name)
      .update()
      .set({
        title,
      })
      .where({
        cabinet_id: cabinetId,
      })
      .execute();
  }

  async updateCabinetStatus(
    cabinetId: number,
    status: CabinetStatusType,
  ): Promise<void> {
    await this.cabinetRepository
      .createQueryBuilder(this.updateCabinetStatus.name)
      .update()
      .set({
        status,
      })
      .where({
        cabinet_id: cabinetId,
      })
      .execute();
  }

  async updateCabinetMaxUser(
    cabinetId: number,
	max_user: number,
  ): Promise<void> {
	await this.cabinetRepository
      .createQueryBuilder(this.updateCabinetMaxUser.name)
      .update()
      .set({
        max_user,
      })
      .where({
        cabinet_id: cabinetId,
      })
      .execute();
  }

  async isCabinetExist(cabinetId: number): Promise<boolean> {
    const result = await this.cabinetRepository.findOne({
      where: {
        cabinet_id: cabinetId,
      },
    });
    return result === null ? false : true;
  }
}
