import { InjectRepository } from "@nestjs/typeorm";
import { IAdminReturnRepository } from "src/admin/return/repository/return.repository.interface";
import { ReturnCabinetDataDto } from "src/dto/return.cabinet.data.dto";
import { UserDto } from "src/dto/user.dto";
import Cabinet from "src/entities/cabinet.entity";
import Lent from "src/entities/lent.entity";
import LentLog from "src/entities/lent.log.entity";
import { Repository } from "typeorm";
import { IsolationLevel, Propagation, Transactional } from "typeorm-transactional";

export class AdminReturnRepository implements IAdminReturnRepository {
    constructor(
      @InjectRepository(Cabinet) private cabinetRepository: Repository<Cabinet>,
      @InjectRepository(Lent) private lentRepository: Repository<Lent>,
      @InjectRepository(LentLog) private lentLogRepository: Repository<LentLog>,
    ) {}
  
    @Transactional({
      propagation: Propagation.REQUIRED,
      isolationLevel: IsolationLevel.SERIALIZABLE,
    })
    async getReturnCabinetData(
      cabinet_id: number,
    ): Promise<ReturnCabinetDataDto> {
      const result = await this.cabinetRepository.find({
        relations: {
          lent: true,
        },
        select: {
          status: true,
          lent_type: true,
          lent: true,
        },
        where: {
          cabinet_id: cabinet_id,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });
      if (result.length === 0) {
        return null;
      }
      return {
        status: result[0].status,
        lent_type: result[0].lent_type,
        lents: result[0].lent,
      };
    }
  
    @Transactional({
      propagation: Propagation.REQUIRED,
      isolationLevel: IsolationLevel.SERIALIZABLE,
    })
    async clearCabinetInfo(cabinet_id: number): Promise<void> {
      await this.cabinetRepository
        .createQueryBuilder()
        .update({
          title: null,
          memo: null,
        })
        .where({
          cabinet_id: cabinet_id,
        })
        .execute();
    }
  
    @Transactional({
      propagation: Propagation.REQUIRED,
      isolationLevel: IsolationLevel.SERIALIZABLE,
    })
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
  
    async addLentLog(
      lent: Lent,
      user: UserDto,
      cabinet_id: number,
    ): Promise<void> {
      await this.lentLogRepository
        .createQueryBuilder(this.addLentLog.name)
        .insert()
        .into(LentLog)
        .values({
          log_user_id: user.user_id,
          log_intra_id: user.intra_id,
          log_cabinet_id: cabinet_id,
          lent_time: lent.lent_time,
          return_time: new Date(),
        })
        .execute();
    }
  
    async getUsersByCabinetId(cabinet_id: number): Promise<number[]> {
      const result = await this.lentRepository.find({
        select: {
          lent_user_id: true,
        },
        where: {
          lent_cabinet_id: cabinet_id,
        },
      });
      if (result.length === 0) {
        return null;
      }
      return result.map((lent) => lent.lent_user_id);
    }
  }
  