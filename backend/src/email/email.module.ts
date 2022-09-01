import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './email.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BanModule } from 'src/ban/ban.module';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { ConfigModule } from '@nestjs/config';
import MailerConfigService from 'src/config/mailer.config';

@Module({
  imports: [
    BanModule,
    CabinetModule,
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailerConfigService,
    }),
  ],

  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
