import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { IBanRepository } from './repository/ban.repository';
import { RawqueryBanRepository } from './repository/rawquery.ban.repository';

const repo = {
  provide: IBanRepository,
  useClass: RawqueryBanRepository,
};

@Module({
  providers: [BanService, repo],
  exports: [BanService],
})
export class BanModule {}
