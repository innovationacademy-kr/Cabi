import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BanModule } from 'src/ban/ban.module';
import { EventController } from './event.controller';
import { EventService } from './evnet.service';
import { IEventRepository } from './repository/IEventRepository';
import { RawqueryEventRepository } from './repository/rawquery-event.repository';

const repo = {
  provide: IEventRepository,
  useClass: RawqueryEventRepository,
};

@Module({
  imports: [AuthModule, BanModule],
  controllers: [EventController],
  providers: [EventService, repo],
})
export class SearchModule {}
