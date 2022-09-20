import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BanModule } from 'src/ban/ban.module';
import { LentController } from './lent.controller';
import { LentService } from './lent.service';

@Module({
  imports: [AuthModule, BanModule],
  controllers: [LentController],
  providers: [LentService],
})
export class LentModule {}
