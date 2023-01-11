import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import Cabinet from 'src/entities/cabinet.entity';
import { AdminCabinetController } from './cabinet.controller';
import { AdminCabinetService } from './cabinet.service';
import { AdminCabinetRepository } from './repository/cabinet.repository';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { CabinetInfoRepository } from 'src/cabinet/repository/cabinet.info.repository';

const adminRepo = {
  provide: 'IAdminCabinetRepository',
  useClass: AdminCabinetRepository,
};

const mainRepo = {
  provide: 'ICabinetInfoRepository',
  useClass: CabinetInfoRepository,
};

@Module({
  controllers: [AdminCabinetController],
  providers: [AdminCabinetService, adminRepo, mainRepo],
  imports: [AuthModule, CabinetModule, TypeOrmModule.forFeature([Cabinet])],
})
export class AdminCabinetModule {}
