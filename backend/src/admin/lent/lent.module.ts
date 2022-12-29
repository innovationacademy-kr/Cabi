import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import Lent from 'src/entities/lent.entity';
import { LentController } from './lent.controller';

@Module({
  controllers: [LentController],
  providers: [],
  imports: [AuthModule],
})
export class LentModule {}
