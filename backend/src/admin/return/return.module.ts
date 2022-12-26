import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ReturnController } from './Return.controller';

@Module({
  controllers: [ReturnController],
  providers: [],
  imports: [AuthModule],
})
export class ReturnModule {}
