import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Cabinet from 'src/entities/cabinet.entity';
import { CabinetController } from './cabinet.info.controller';
import { CabinetInfoService } from './cabinet.info.service';
import { CabinetInfoRepository } from './repository/cabinet.info.repository';

const repo = {
  provide: 'ICabinetInfoRepository',
  useClass: CabinetInfoRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Cabinet],
    ),
  ],
  exports: [
    CabinetInfoService,
  ],
  controllers: [CabinetController],
  providers: [CabinetInfoService, repo],
})
export class CabinetModule {}
