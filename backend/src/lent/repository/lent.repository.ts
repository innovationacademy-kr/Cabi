import { InjectRepository } from '@nestjs/typeorm';
import { LentDto } from 'src/dto/lent.dto';
import { SimpleCabinetDataDto } from 'src/dto/simple.cabinet.data.dto';
import { UserDto } from 'src/dto/user.dto';
import Cabinet from 'src/entities/cabinet.entity';
import Lent from 'src/entities/lent.entity';
import LentLog from 'src/entities/lent.log.entity';
import { Repository } from 'typeorm';
import {
  IsolationLevel,
  Propagation,
  Transactional,
} from 'typeorm-transactional';
import { ILentRepository } from './lent.repository.interface';

export class lentRepository implements ILentRepository {
  constructor(
    @InjectRepository(Lent)
    private lentRepository: Repository<Lent>,
    @InjectRepository(LentLog)
    private lentLogRepository: Repository<LentLog>,
    @InjectRepository(Cabinet)
    private cabinetLogRepository: Repository<Cabinet>,
  ) {}

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async getIsLent(user_id: number): Promise<boolean> {
    const result = await this.lentRepository.findOne({
      where: {
        lent_user_id: user_id,
      },
    });
    if (!result) {
      return false;
    }
    return true;
  }

  //TODO: lent component 수정 후 사용되지 않는 함수입니다.
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

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async setExpireTime(lent_id: number, expire_time: Date): Promise<void> {
    expire_time.setHours(23, 59, 59, 999);
    await this.lentRepository
      .createQueryBuilder()
      .update(Lent)
      .set({
        expire_time: expire_time,
      })
      .where({
        lent_id: lent_id,
      })
      .execute();
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async setExpireTimeAll(cabinet_id: number, expire_time: Date): Promise<void> {
    expire_time.setHours(23, 59, 59, 999);
    await this.lentRepository
      .createQueryBuilder()
      .update(Lent)
      .set({
        expire_time: expire_time,
      })
      .where({
        lent_cabinet_id: cabinet_id,
      })
      .execute();
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async lentCabinet(user: UserDto, cabinet_id: number): Promise<LentDto> {
    const lent_time = new Date();
    const expire_time: Date | null = null;
    const result = await this.lentRepository
      .createQueryBuilder(this.lentCabinet.name)
      .insert()
      .into(Lent)
      .values({
        lent_user_id: user.user_id,
        lent_cabinet_id: cabinet_id,
        lent_time: lent_time,
        expire_time: expire_time,
      })
      .execute();
    return {
      user_id: user.user_id,
      intra_id: user.intra_id,
      lent_id: result.identifiers.pop()['lent_id'],
      lent_time,
      expire_time,
      is_expired: false,
    };
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
        },
      },
      where: {
        lent_user_id: user_id,
      },
    });
    if (result === null) {
      return null;
    }
    return result.lent_cabinet_id;
  }

  async updateLentCabinetTitle(
    cabinet_title: string | null,
    cabinet_id: number,
  ): Promise<void> {
    if (cabinet_title === '') {
      cabinet_title = null;
    }
    await this.lentRepository
      .createQueryBuilder(this.updateLentCabinetTitle.name)
      .update('cabinet')
      .set({
        title: cabinet_title,
      })
      .where({
        cabinet_id: cabinet_id,
      })
      .execute();
  }

  async updateLentCabinetMemo(
    cabinet_memo: string | null,
    cabinet_id: number,
  ): Promise<void> {
    if (cabinet_memo === '') {
      cabinet_memo = null;
    } else {
      cabinet_memo = Buffer.from(cabinet_memo, 'utf8').toString('base64');
    }
    await this.lentRepository
      .createQueryBuilder(this.updateLentCabinetMemo.name)
      .update('cabinet')
      .set({
        memo: cabinet_memo,
      })
      .where({
        cabinet_id: cabinet_id,
      })
      .execute();
  }

  async getLent(user_id: number): Promise<Lent> {
    const result = await this.lentRepository.findOne({
      relations: {
        cabinet: true,
        user: true,
      },
      where: {
        lent_user_id: user_id,
      },
    });
    return result;
  }

  async getAllLent(): Promise<Lent[]> {
    const result = await this.lentRepository.find({
      relations: {
        user: true,
        cabinet: true,
      },
    });
    return result;
  }

  async deleteLentByLentId(lent_id: number): Promise<void> {
    await this.lentRepository
      .createQueryBuilder(this.deleteLentByLentId.name)
      .delete()
      .from(Lent)
      .where({
        lent_id: lent_id,
      })
      .execute();
  }

  async addLentLog(lent: Lent): Promise<void> {
    await this.lentLogRepository
      .createQueryBuilder(this.addLentLog.name)
      .insert()
      .into(LentLog)
      .values({
        log_user_id: lent.user.user_id,
        log_intra_id: lent.user.intra_id,
        log_cabinet_id: lent.cabinet.cabinet_id,
        lent_time: lent.lent_time,
        return_time: new Date(),
      })
      .execute();
  }

  async getSimpleCabinetData(
    cabinet_id: number,
  ): Promise<SimpleCabinetDataDto> {
    const result = await this.cabinetLogRepository
      .createQueryBuilder('c')
      .select(['c.cabinet_status', 'c.lent_type', 'c.max_user'])
      .leftJoin(Lent, 'l', 'l.lent_cabinet_id = c.cabinet_id')
      .addSelect('l.expire_time', 'expire_time')
      .addSelect('l.lent_id', 'lent_id')
      .where('c.cabinet_id = :cabinet_id', { cabinet_id })
      .execute();

    return {
      status: result[0].cabinet_status,
      lent_type: result[0].c_lent_type,
      lent_count: result[0].lent_id === null ? 0 : result.length,
      expire_time:
        result[0].lent_id === null ? undefined : result[0].expire_time,
      max_user: result[0].c_max_user,
    };
  }
}
