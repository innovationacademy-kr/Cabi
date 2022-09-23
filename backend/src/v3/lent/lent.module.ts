import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BanModule } from 'src/ban/ban.module';
import { CabinetModule } from '../cabinet/cabinet.module';
import Lent from 'src/entities/lent.entity';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { LentController } from './lent.controller';
import { LentService } from './lent.service';
import { lentRepository } from './repository/lent.repository';
import { ILentRepository } from './repository/lent.repository.interface';

const repo = {
  provide: ILentRepository,
  useClass: lentRepository,
};

@Module({
  imports: [CabinetModule, AuthModule, BanModule, TypeOrmModule.forFeature([Lent])],
  controllers: [LentController],
  providers: [LentService, repo],
})
export class LentModule {}
