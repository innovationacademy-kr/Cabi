import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AdminReturnController } from './return.controller';

@Module({
  controllers: [AdminReturnController],
  providers: [],
  imports: [AuthModule],
})
export class ReturnModule {}
