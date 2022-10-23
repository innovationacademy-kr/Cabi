import { InjectRepository } from '@nestjs/typeorm';
import BanLog from 'src/entities/ban.log.entity';
import { Repository } from 'typeorm';
import { IBetatestRepository } from './betatest.repository.interface';

export class BetatestRepository implements IBetatestRepository {
  constructor(
    @InjectRepository(BanLog) private banLogRepository: Repository<BanLog>,
  ) {}

  async deleteBanLog(user_id: number): Promise<boolean> {
    return await this.banLogRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const find = await transactionalEntityManager.find(BanLog, {
          where: {
            ban_user_id: user_id,
          },
        });
        if (find.length === 0) {
          return false;
        }
        await transactionalEntityManager.delete(BanLog, {
          ban_user_id: user_id,
        });
        return true;
      },
    );
  }
}
