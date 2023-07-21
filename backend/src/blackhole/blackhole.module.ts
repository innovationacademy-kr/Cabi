import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlackholeService } from './blackhole.service';
import { AuthModule } from 'src/auth/auth.module';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { LentModule } from 'src/lent/lent.module';
import { UserModule } from 'src/user/user.module';
import { BlackholeTools } from './blackhole.component';

@Module({
  imports: [AuthModule, CabinetModule, HttpModule, UserModule, LentModule],
  providers: [BlackholeService, BlackholeTools],
})
export class BlackholeModule {}
