import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BanModule } from 'src/ban/ban.module';
import MailerConfigService from 'src/config/mailer.config';
import { LentModule } from 'src/lent/lent.module';
import { CabinetModule } from '../cabinet/cabinet.module';
import { EmailSender } from './email.sender.component';
import { ExpiredChecker } from './expired.checker.component';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailerConfigService,
    }),
    CabinetModule,
    LentModule,
    BanModule,
  ],

  providers: [EmailSender, ExpiredChecker],
  exports: [EmailSender],
})
export class UtilsModule {}
