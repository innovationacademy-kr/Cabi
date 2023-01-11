import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './repository/search.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import Cabinet from 'src/entities/cabinet.entity';
import BanLog from 'src/entities/ban.log.entity';

const repo = {
  provide: 'ISearchRepository',
  useClass: SearchRepository,
};

@Module({
  controllers: [SearchController],
  providers: [SearchService, repo],
  imports: [AuthModule, TypeOrmModule.forFeature([User, Cabinet, BanLog])],
})
export class SearchModule {}
