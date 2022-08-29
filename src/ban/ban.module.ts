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
})
export class BanModule {}
