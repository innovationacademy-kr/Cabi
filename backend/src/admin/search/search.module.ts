import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SearchController } from './search.controller';

@Module({
  controllers: [SearchController],
  providers: [],
  imports: [AuthModule],
})
export class SearchModule {}
