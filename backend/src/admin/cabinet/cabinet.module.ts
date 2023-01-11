import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import Cabinet from 'src/entities/cabinet.entity';
import { AdminCabinetController } from './cabinet.controller';
import { AdminCabinetService } from './cabinet.service';
import { AdminCabinetRepository } from './repository/cabinet.repository';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { CabinetInfoRepository } from 'src/cabinet/repository/cabinet.info.repository';

const adminCabinetRepo = {
  provide: 'IAdminCabinetRepository',
  useClass: AdminCabinetRepository,
};

const mainCabinetInfoRepo = {
  provide: 'ICabinetInfoRepository',
  useClass: CabinetInfoRepository,
};

@Module({
  controllers: [AdminCabinetController],
  providers: [AdminCabinetService, adminCabinetRepo, mainCabinetInfoRepo],
  imports: [AuthModule, CabinetModule, TypeOrmModule.forFeature([Cabinet])],
  exports: [AdminCabinetService, adminCabinetRepo, mainCabinetInfoRepo],
})
export class AdminCabinetModule {}
