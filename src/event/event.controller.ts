import { Controller, Get, Logger, Post } from '@nestjs/common';
import { EventInfoDto } from './dto/event-info.dto';
import { EventService } from './evnet.service';

@Controller('/api/event')
export class EventController {
  constructor(private eventService: EventService) {}
  private logger = new Logger(EventController.name);

  @Get('list')
  // FIXME: UseGuards / loginBanCheck 추가
  async getList(intra_id: string): Promise<EventInfoDto[]> {
    this.logger.log('call getList');
    return await this.eventService.getEventInfo(intra_id);
  }

  @Post('lent')
  async postLent(intra_id: string): Promise<string | { status: boolean }> {
    this.logger.log('call postList');
    if ((await this.eventService.checkEventLimit()) === true) {
      await this.eventService.insertEventInfo(intra_id);
      return 'ok';
    }
    return { status: false };
  }

  @Post('return')
  async postReturn(intra_id: string) {
    this.logger.log('call postReturn');
    await this.eventService.updateEventInfo(intra_id);
  }

  @Get('winner')
  async getWinner(intra_id: string) {
    this.logger.log('call getWinner');
    await this.eventService.checkEventInfo(intra_id);
  }
}
