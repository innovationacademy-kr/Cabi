import { Module } from '@nestjs/common';
import { CabinetController } from './cabinet.controller';
import { CabinetService } from './cabinet.service';

@Module({
  controllers: [CabinetController],
  providers: [CabinetService],
})
export class CabinetModule {}
