import { Module } from '@nestjs/common';
import { BlackholeController } from './blackhole.controller';
import { HttpModule } from '@nestjs/axios';
import { BlackholeService } from './blackhole.service';

@Module({
  controllers: [BlackholeController],
  imports: [HttpModule],
  providers: [BlackholeService],
})
export class BlackholeModule {

}
