import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import BanUser from 'src/entities/ban.log.entity';
// import { TypeOrmExModule } from 'src/typeorm-ex/typeorm-ex.module';
import { BanService } from './ban.service';
import { IBanRepository } from './repository/ban.repository';
import { RawqueryBanRepository } from './repository/rawquery.ban.repository';

const repo = {
  provide: IBanRepository,
  useClass: RawqueryBanRepository,
};

@Module({
  /*imports: [
    TypeOrmModule.forFeature([BanUser]),
    TypeOrmExModule.forCustomRepository([BanRepository]),
  ],
  추후 typeorm 사용
  */
  providers: [BanService, repo],
  exports: [BanService],
})
export class BanModule {}
