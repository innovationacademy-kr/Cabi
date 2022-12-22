import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { UtilsModule } from 'src/utils/utils.module';
import BanLog from '../entities/ban.log.entity';
import { UserModule } from '../user/user.module';
import { BanService } from './ban.service';
import { BanRepository } from './repository/ban.repository';

const repo = {
  provide: 'IBanRepository',
  useClass: BanRepository,
};

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([BanLog]),
    CabinetModule,
    UtilsModule,
  ],
  providers: [BanService, repo],
  exports: [BanService],
})
export class BanModule {}
