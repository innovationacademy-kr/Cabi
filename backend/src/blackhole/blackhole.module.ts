import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlackholeService } from './blackhole.service';
import { IBlackholeRepository } from './repository/blackhole.repository';
import { RawqueryBlackholeRepository } from './repository/rawquery.blackhole.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { LentModule } from 'src/lent/lent.module';
import { UserModule } from 'src/user/user.module';

const repo = {
  provide: IBlackholeRepository,
  useClass: RawqueryBlackholeRepository,
};

@Module({
  imports: [AuthModule, CabinetModule, HttpModule, UserModule, LentModule],
  providers: [BlackholeService, repo],
  // exports: [BlackholeService]
})
export class BlackholeModule {}
