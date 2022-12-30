import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LogController } from './log.controller';

@Module({
  controllers: [LogController],
  providers: [],
  imports: [AuthModule],
})
export class LogModule {}
