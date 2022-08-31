import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private appService: AppService) {}
  @Get('/test')
  async test(): Promise<void> {
    return await this.appService.test();
  }
}
