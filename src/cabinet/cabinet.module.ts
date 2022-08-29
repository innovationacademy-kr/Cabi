import { Module } from '@nestjs/common';
import { CabinetController } from './cabinet.controller';
import { CabinetService } from './cabinet.service';
import { ICabinetRepository } from './repository/cabinet.repository';
import { RawqueryCabinetRepository } from './repository/rawquery.cabinet.repository';

const repo = {
  provide: ICabinetRepository,
  useClass: RawqueryCabinetRepository,
};

@Module({
  controllers: [CabinetController],
  providers: [CabinetService, repo],
})
export class CabinetModule {}
