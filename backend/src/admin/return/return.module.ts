import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCabinetModule } from 'src/admin/cabinet/cabinet.module';
import { AdminReturnRepository } from 'src/admin/return/repository/return.repository';
import { ReturnTools } from 'src/admin/return/return.component';
import { AdminReturnService } from 'src/admin/return/return.service';
import { AuthModule } from 'src/auth/auth.module';
import { BanModule } from 'src/ban/ban.module';
import Cabinet from 'src/entities/cabinet.entity';
import Lent from 'src/entities/lent.entity';
import LentLog from 'src/entities/lent.log.entity';
import { LentModule } from 'src/lent/lent.module';
import { UserModule } from 'src/user/user.module';
import { DateCalculator } from 'src/utils/date.calculator.component';
import { UtilsModule } from 'src/utils/utils.module';
import { AdminReturnController } from './return.controller';

const adminReturnRepo = {
  provide: 'IAdminReturnRepository',
  useClass: AdminReturnRepository,
};

@Module({
  controllers: [AdminReturnController],
  providers: [adminReturnRepo, AdminReturnService, ReturnTools],
  imports: [
    AuthModule,
    UserModule,
    LentModule,
    AdminCabinetModule,
    BanModule,
    UtilsModule,
    TypeOrmModule.forFeature([Cabinet, Lent, LentLog]),
  ],
})
export class AdminReturnModule {}
