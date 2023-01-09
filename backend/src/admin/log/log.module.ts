import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogService } from 'src/admin/log/log.service';
import { LogRepository } from 'src/admin/log/repository/log.repository';
import { AuthModule } from 'src/auth/auth.module';
import LentLog from 'src/entities/lent.log.entity';
import { LogController } from './log.controller';

const repo = {
  provide: 'ILogRepository',
  useClass: LogRepository,
}
@Module({
  controllers: [LogController],
  providers: [LogService, repo],
  imports: [AuthModule, TypeOrmModule.forFeature([LentLog])],
  exports: [LogService],
  // User에서 MyLentLog를 보기 위해 LogService를 Export 합니다.
})
export class LogModule {}