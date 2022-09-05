import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlackholeService } from './blackhole.service';
import { IBlackholeRepository } from './repository/blackhole.repository';
import { RawqueryBlackholeRepository } from './repository/rawquery.blackhole.repository';
import { AuthModule } from 'src/auth/auth.module';

const repo = {
  provide: IBlackholeRepository,
  useClass: RawqueryBlackholeRepository,
};

@Module({
  imports: [
    AuthModule,
    HttpModule,
  ],
  providers: [BlackholeService, repo],
  // exports: [BlackholeService]
})
export class BlackholeModule {}
