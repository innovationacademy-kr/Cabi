import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlackholeService } from './blackhole.service';
import { IBlackholeRepository } from './repository/blackhole.repository';
import { RawqueryBlackholeRepository } from './repository/rawquery.blackhole.repository';

const repo = {
  provide: IBlackholeRepository,
  useClass: RawqueryBlackholeRepository,
};

@Module({
  imports: [HttpModule],
  providers: [BlackholeService, repo],
  // exports: [BlackholeService]
})
export class BlackholeModule {

}
