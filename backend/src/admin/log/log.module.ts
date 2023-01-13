import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLogService } from 'src/admin/log/log.service';
import { AdminLogRepository } from 'src/admin/log/repository/log.repository';
import { AuthModule } from 'src/auth/auth.module';
import LentLog from 'src/entities/lent.log.entity';
import { AdminLogController } from './log.controller';

const adminLogRepo = {
  provide: 'IAdminLogRepository',
  useClass: AdminLogRepository,
};
@Module({
  controllers: [AdminLogController],
  providers: [AdminLogService, adminLogRepo],
  imports: [AuthModule, TypeOrmModule.forFeature([LentLog])],
  exports: [AdminLogService, adminLogRepo],
  // User에서 MyLentLog를 보기 위해 LogService를 Export 합니다.
})
export class AdminLogModule {}
