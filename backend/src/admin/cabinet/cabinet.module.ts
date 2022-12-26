import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CabinetController } from './cabinet.controller';

@Module({
  controllers: [CabinetController],
  providers: [],
  imports: [AuthModule],
})
export class CabinetModule {}
