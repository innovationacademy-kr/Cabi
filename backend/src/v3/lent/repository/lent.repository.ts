import { InjectRepository } from '@nestjs/typeorm';
import { LentDto } from 'src/dto/lent.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import Lent from 'src/entities/lent.entity';
import LentLog from 'src/entities/lent.log.entity';
import { QueryRunner, Repository } from 'typeorm';
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

  async setExpireTime(
    lent_id: number,
    expire_time: Date,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    await this.lentRepository
      .createQueryBuilder(this.setExpireTime.name, queryRunner)
      .update(Lent)
      .set({
        expire_time: expire_time,
      })
      .where({
        lent_id: lent_id,
      })
      .execute();
  }

  async lentCabinet(
    user: UserSessionDto,
    cabinet_id: number,
    queryRunner: QueryRunner,
  ): Promise<LentDto> {
    const lent_time = new Date();
    const expire_time: Date | null = null;
    const result = await this.lentRepository
      .createQueryBuilder(this.lentCabinet.name, queryRunner)
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
        user: {
          user_id: user_id,
        },
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
      .createQueryBuilder()
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
    }
    await this.lentRepository
      .createQueryBuilder()
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
      },
      where: {
        lent_user_id: user_id,
      },
    });
    return result;
  }

  async deleteLentByLentId(lent_id: number): Promise<void> {
    await this.lentRepository
      .createQueryBuilder()
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
