import { Module } from '@nestjs/common';
import { BanService } from './ban.service';

@Module({
  providers: [BanService],
})
export class BanModule {}
