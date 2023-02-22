import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SearchController } from './search.controller';
import { AdminSearchService } from './search.service';
import { AdminSearchRepository } from './repository/search.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import Cabinet from 'src/entities/cabinet.entity';
import BanLog from 'src/entities/ban.log.entity';
import Lent from 'src/entities/lent.entity';
import LentLog from 'src/entities/lent.log.entity';

const adminSearchRepo = {
  provide: 'IAdminSearchRepository',
  useClass: AdminSearchRepository,
};

@Module({
  controllers: [SearchController],
  providers: [AdminSearchService, adminSearchRepo],
  imports: [AuthModule, TypeOrmModule.forFeature([User, Cabinet, BanLog, Lent, LentLog])],
})
export class AdminSearchModule {}
