import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BanLog from '../../../entities/ban.log.entity';
import { IBanRepository } from './ban.repository.interface';

export class BanRepository implements IBanRepository {
  constructor(
    @InjectRepository(BanLog) private banLogRepository: Repository<BanLog>,
  ) {}

  async getUnbanedDate(userId: number): Promise<Date | null> {
    const result = await this.banLogRepository.findOne({
      where: {
        ban_user_id: userId,
      },
      order: {
        unbanned_date: 'DESC',
      },
    });
    return result ? result.unbanned_date : null;
  }
}
