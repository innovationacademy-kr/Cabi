import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CabinetModule } from '../cabinet/cabinet.module';
import Lent from 'src/entities/lent.entity';
import { LentController } from './lent.controller';
import { LentService } from './lent.service';
import { lentRepository } from './repository/lent.repository';
import LentLog from 'src/entities/lent.log.entity';
import { BanModule } from '../ban/ban.module';
import { LentMockController } from './lent.mock.controller';
import { LentTools } from './lent.component';

const repo = {
  provide: 'ILentRepository',
  useClass: lentRepository,
};

@Module({
  imports: [
    CabinetModule,
    AuthModule,
    BanModule,
    TypeOrmModule.forFeature([Lent, LentLog]),
  ],
  controllers: [LentController, LentMockController],
  providers: [LentService, repo],
  exports: [LentService],
})
export class LentModule {}
