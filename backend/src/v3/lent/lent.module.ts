import { Module } from '@nestjs/common';
import { LentController } from './lent.controller';

@Module({
  controllers: [LentController],
})
export class LentModule {}
