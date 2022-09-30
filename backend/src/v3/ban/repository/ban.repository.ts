import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BanLog from '../../../entities/ban.log.entity';
import { IBanRepository } from './ban.repository.interface';

export class BanRepository implements IBanRepository {
  constructor(
    @InjectRepository(BanLog) private banLogRepository: Repository<BanLog>,
  ) {}

  async getUnbanedDate(user_id: number): Promise<Date | null> {
    const result = await this.banLogRepository.findOne({
      where: {
        ban_user_id: user_id,
      },
      order: {
        unbanned_date: 'DESC',
      },
    });
    return result ? result.unbanned_date : null;
  }

  async addToBanLogByUserId(user_id: number, ban_day: number): Promise<void> {
    const unbanned_date = new Date();
    unbanned_date.setDate(unbanned_date.getDate() + ban_day);
    await this.banLogRepository
      .createQueryBuilder()
      .update('ban_log')
      .set({
        unbanned_date: unbanned_date,
      })
      .where({
        ban_user_id: user_id,
      })
      .execute();
  }
}
