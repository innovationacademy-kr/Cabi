import { Module } from '@nestjs/common';
import { CabinetController } from './cabinet.controller';

@Module({
  controllers: [CabinetController],
})
export class CabinetModule {}
