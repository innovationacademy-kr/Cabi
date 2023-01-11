import { InjectRepository } from '@nestjs/typeorm';
import { LogPagenationDto } from 'src/admin/dto/log.pagenation.dto';
import { ILogRepository } from 'src/admin/log/repository/log.interface.repository';
import Cabinet from 'src/entities/cabinet.entity';
import LentLog from 'src/entities/lent.log.entity';
import { Repository } from 'typeorm';

export class LogRepository implements ILogRepository {
    constructor(
      @InjectRepository(LentLog)
      private LogRepository: Repository<LentLog>,
    ) {}

async getLentLogByUserId(
    userId: number,
    index: number,
    length: number,
  ): Promise<LogPagenationDto> {
    // lent_log 테이블과 cabinet 테이블을 조인함.
    const result = await this.LogRepository
      .createQueryBuilder('ll')
      .select([
        'll.log_user_id',
        'll.log_intra_id',
        'll.log_cabinet_id',
        'll.lent_time',
        'll.return_time',
        'COUNT(*) OVER () AS cnt',
      ])
      .leftJoin(Cabinet, 'c', 'll.log_cabinet_id = c.cabinet_id')
      .addSelect([
        'c.cabinet_id',
        'c.cabinet_num',
        'c.location',
        'c.section',
        'c.floor',
      ])
      .where('ll.log_user_id = :user_id', { user_id: userId })
      .limit(length)
      .offset(index)
      .orderBy('ll.lent_time', 'ASC')
      .execute();
    const rtn = {
      result: result.map((r) => ({
        user_id: r.ll_log_user_id,
        intra_id: r.ll_log_intra_id,
        cabinet_id: r.ll_log_cabinet_id,
        cabinet_num: r.c_cabinet_num,
        location: r.c_location,
        floor: r.c_floor,
        section: r.c_section,
        lent_time: r.ll_lent_time,
        return_time: r.ll_return_time,
      })),
      total_length: result.length !== 0 ? parseInt(result[0].cnt, 10) : 0,
    };
    return rtn;
  }

  async getLentLogByCabinetId(
    cabinetId: number,
    index: number,
    length: number,
  ): Promise<LogPagenationDto> {
    // lent_log 테이블과 cabinet 테이블을 조인함.
    const result = await this.LogRepository
      .createQueryBuilder('ll')
      .select([
        'll.log_user_id',
        'll.log_intra_id',
        'll.log_cabinet_id',
        'll.lent_time',
        'll.return_time',
        'COUNT(*) OVER () AS cnt',
      ])
      .leftJoin(Cabinet, 'c', 'll.log_cabinet_id = c.cabinet_id')
      .addSelect([
        'c.cabinet_id',
        'c.cabinet_num',
        'c.location',
        'c.section',
        'c.floor',
      ])
      .where('ll.log_cabinet_id = :cabinet_id', { cabinetId })
      .limit(length)
      .offset(index)
      .orderBy('ll.lent_time', 'ASC')
      .execute();
    const rtn = {
      result: result.map((r) => ({
        user_id: r.ll_log_user_id,
        intra_id: r.ll_log_intra_id,
        cabinet_id: r.ll_log_cabinet_id,
        cabinet_num: r.c_cabinet_num,
        location: r.c_location,
        floor: r.c_floor,
        section: r.c_section,
        lent_time: r.ll_lent_time,
        return_time: r.ll_return_time,
      })),
      total_length: result.length !== 0 ? parseInt(result[0].cnt, 10) : 0,
    };
    return rtn;
  }
}
