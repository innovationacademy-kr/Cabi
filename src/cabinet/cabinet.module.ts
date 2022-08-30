import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BanModule } from 'src/ban/ban.module';
import { CabinetController } from './cabinet.controller';
import { CabinetService } from './cabinet.service';
import { ICabinetRepository } from './repository/cabinet.repository';
import { RawqueryCabinetRepository } from './repository/rawquery.cabinet.repository';

const repo = {
  provide: ICabinetRepository,
  useClass: RawqueryCabinetRepository,
};

@Module({
  imports: [AuthModule, BanModule],
  controllers: [CabinetController],
  providers: [CabinetService, repo],
})
export class CabinetModule {}
