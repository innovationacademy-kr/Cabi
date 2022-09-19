import { Module } from '@nestjs/common';
import { AuthModule } from './auth/Auth.module';
import { CabinetModule } from './cabinet/cabinet.module';
import { LentModule } from './lent/lent.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, CabinetModule, LentModule, UserModule],
  controllers: [],
  providers: [],
})
export class V3Module {}
