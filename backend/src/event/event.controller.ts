import { Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSessionDto } from '../auth/dto/user.session.dto';
import { JwtAuthGuard } from '../auth/jwt/guard/jwtauth.guard';
import { User } from '../auth/user.decorator';
import { BanCheckGuard } from '../ban/guard/ban-check.guard';
import { EventInfoDto } from './dto/event-info.dto';
import { EventService } from './evnet.service';

@ApiTags('Event')
@Controller('/api/event')
@UseGuards(JwtAuthGuard, BanCheckGuard)
export class EventController {
  constructor(private eventService: EventService) {}
  private logger = new Logger(EventController.name);

  @ApiOperation({
    summary: '유저 & 짝 유저의 이벤트 정보',
    description: '호출한 유저와 짝 유저의 이벤트 정보를 리턴합니다.',
  })
  @Get('list')
  async getList(@User() user: UserSessionDto): Promise<EventInfoDto[]> {
    this.logger.log('call getList');
    return await this.eventService.getEventInfo(user.intra_id);
  }

  @ApiOperation({
    summary: '이벤트 당첨 유저 추가',
    description:
      '이벤트 당첨 가능 여부를 확인 후 해당 유저를 이벤트 당첨자에 추가합니다.',
  })
  @Post('lent')
  async postLent(
    @User() user: UserSessionDto,
  ): Promise<string | { status: boolean }> {
    this.logger.log('call postList');
    if ((await this.eventService.checkEventLimit()) === true) {
      await this.eventService.insertEventInfo(user.intra_id);
      return 'ok';
    }
    return { status: false };
  }

  @ApiOperation({
    summary: '특정 유저 이벤트 정보 업데이트',
    description: '특정 유저의 이벤트 정보를 업데이트 합니다.',
  })
  @Post('return')
  async postReturn(@User() user: UserSessionDto) {
    this.logger.log('call postReturn');
    await this.eventService.updateEventInfo(user.intra_id);
  }

  @ApiOperation({
    summary: '특정 유저의 이벤트 당첨 여부',
    description: '특정 유저의 이벤트 당첨 여부를 리턴합니다.',
  })
  @Get('winner')
  async getWinner(@User() user: UserSessionDto) {
    this.logger.log('call getWinner');
    await this.eventService.checkEventInfo(user.intra_id);
  }
}
