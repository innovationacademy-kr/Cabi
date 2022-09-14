import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BanUser from 'src/entities/ban.user.entity';
import { TypeOrmExModule } from 'src/typeorm-ex/typeorm-ex.module';
import { BanService } from './ban.service';
import { BanRepository, IBanRepository } from './repository/ban.repository';
import { RawqueryBanRepository } from './repository/rawquery.ban.repository';

const repo = {
  provide: IBanRepository,
  useClass: RawqueryBanRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([BanUser]),
    TypeOrmExModule.forCustomRepository([BanRepository]),
  ],
  providers: [BanService, repo],
  exports: [BanService],
})
export class BanModule {}
