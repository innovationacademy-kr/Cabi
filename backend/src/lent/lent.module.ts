import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CabinetModule } from '../cabinet/cabinet.module';
import Lent from 'src/entities/lent.entity';
import { LentController } from './lent.controller';
import { LentService } from './lent.service';
import { lentRepository } from './repository/lent.repository';
import LentLog from 'src/entities/lent.log.entity';
import { BanModule } from '../ban/ban.module';
import { LentTools } from './lent.component';
import Cabinet from 'src/entities/cabinet.entity';
import { UtilsModule } from 'src/utils/utils.module';

const repo = {
  provide: 'ILentRepository',
  useClass: lentRepository,
};

@Module({
  imports: [
    CabinetModule,
    AuthModule,
    forwardRef(() => BanModule),
    UtilsModule,
    TypeOrmModule.forFeature([Lent, LentLog, Cabinet]),
  ],
  controllers: [LentController],
  providers: [LentService, repo, LentTools],
  exports: [LentService, LentTools],
})
export class LentModule {}
