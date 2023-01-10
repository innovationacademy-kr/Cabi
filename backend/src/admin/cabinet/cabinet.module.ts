import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import Cabinet from 'src/entities/cabinet.entity';
import { CabinetController } from './cabinet.controller';
import { CabinetService } from './cabinet.service';
import { CabinetRepository } from './repository/cabinet.repository';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { CabinetInfoRepository } from 'src/cabinet/repository/cabinet.info.repository';


const adminRepo = {
  provide: 'ICabinetRepository',
  useClass: CabinetRepository,
};

const mainRepo = {
  provide: 'ICabinetInfoRepository',
  useClass: CabinetInfoRepository,
}

@Module({
  controllers: [CabinetController],
  providers: [CabinetService, adminRepo, mainRepo],
  imports: [AuthModule, CabinetModule, TypeOrmModule.forFeature([Cabinet])],
})
export class AdminCabinetModule {}
