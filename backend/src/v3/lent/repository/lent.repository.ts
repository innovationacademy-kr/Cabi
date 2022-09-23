import { InjectRepository } from '@nestjs/typeorm';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import Lent from 'src/entities/lent.entity';
import LentLog from 'src/entities/lent.log.entity';
import LentType from 'src/enums/lent.type.enum';
import { Repository } from 'typeorm';
import { ILentRepository } from './lent.repository.interface';

export class lentRepository implements ILentRepository {
  constructor(
    @InjectRepository(Lent)
    private lentRepository: Repository<Lent>,
    @InjectRepository(LentLog)
    private lentLogRepository: Repository<LentLog>,
  ) {}

  async getIsLent(user_id: number): Promise<boolean> {
    const result = await this.lentRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          user_id: user_id,
        },
      },
    });
    if (!result) {
      return false;
    }
    return true;
  }

  async getLentUserCnt(cabinet_id: number): Promise<number> {
    const result: number = await this.lentRepository.count({
      relations: {
        cabinet: true,
      },
      where: {
        cabinet: {
          cabinet_id: cabinet_id,
        },
      },
    });
    return result;
  }

  async lentCabinet(user: UserSessionDto, cabinet: CabinetDto): Promise<void> {
    const lent_time = new Date();
    const expire_time = new Date();
    if (cabinet.lent_type === LentType.PRIVATE) {
      expire_time.setDate(lent_time.getDate() + 30);
    } else {
      expire_time.setDate(lent_time.getDate() + 45);
    }
    await this.lentRepository.insert({
      user: {
        user_id: user.user_id,
      },
      cabinet: {
        cabinet_id: cabinet.cabinet_id,
      },
      lent_time,
      expire_time,
    });
  }

  async getLentCabinetId(user_id: number): Promise<number> {
    const result = await this.lentRepository.findOne({
      relations: {
        user: true,
        cabinet: true,
      },
      select: {
        cabinet: {
          cabinet_id: true,
        }
      },
      where: {
        user: {
          user_id: user_id,
        }
      },
    });
    if (result === null) {
      return null;
    }
    return result.lent_cabinet_id;
  }

  async updateLentCabinetTitle(cabinet_title: string, cabinet_id: number): Promise<void> {
    await this.lentRepository.createQueryBuilder()
    .update('cabinet')
    .set({
        title: cabinet_title
    })
    .where({
        cabinet_id: cabinet_id,
    })
    .execute();
  }

  async updateLentCabinetMemo(cabinet_memo: string, cabinet_id: number): Promise<void> {
    await this.lentRepository.createQueryBuilder()
    .update('cabinet')
    .set({
        memo: cabinet_memo
    })
    .where({
        cabinet_id: cabinet_id,
    })
    .execute();
  }

  async getLent(user_id: number): Promise<Lent> {
    console.log(user_id);
    const result = await this.lentRepository.findOne({
      where: {
        lent_user_id: user_id,
      }
    });
    console.log(result);
    if (result === null) {
      return null;
    }
    return result;
  }

  async deleteLentByLentId(lent_id: number): Promise<void> {
    await this.lentRepository.createQueryBuilder()
    .delete()
    .from(Lent)
    .where({
      lent_id: lent_id,
    })
    .execute();
  }

  async addLentLog(lent: Lent): Promise<void> {
    await this.lentLogRepository.insert({
      user: {
        user_id: lent.lent_user_id,
      },
      cabinet: {
        cabinet_id: lent.lent_cabinet_id,
      },
      lent_time: lent.lent_time,
      return_time: new Date(),
    });
  }
}
