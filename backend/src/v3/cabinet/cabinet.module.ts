import { Module } from '@nestjs/common';
import { CabinetController } from './cabinet.info.controller';

@Module({
  controllers: [CabinetController],
})
export class CabinetModule {}
