import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CabinetModule } from './cabinet/cabinet.module';
import { LentModule } from './lent/lent.module';
import { UserModule } from './user/user.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [AuthModule, CabinetModule, LentModule, UserModule, UtilsModule],
  controllers: [],
  providers: [],
})
export class V3Module {}
