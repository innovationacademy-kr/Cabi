import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BanLog from '../../entities/ban.log.entity';
import { BanService } from './ban.service';
import { BanRepository } from './repository/ban.repository';

const repo = {
  provide: 'IBanRepository',
  useClass: BanRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([BanLog])],
  providers: [BanService, repo],
  exports: [BanService],
})
export class BanModule {}
