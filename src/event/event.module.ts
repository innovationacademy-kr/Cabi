import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './evnet.service';
import { IEventRepository } from './repository/IEventRepository';
import { RawqueryEventRepository } from './repository/rawquery-event.repository';

const repo = {
  provide: IEventRepository,
  useClass: RawqueryEventRepository,
};

@Module({
  controllers: [EventController],
  providers: [EventService, repo],
})
export class SearchModule {}
