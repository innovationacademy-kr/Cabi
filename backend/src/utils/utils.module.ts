import { MailerModule } from '@nestjs-modules/mailer';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import MailerConfigService from 'src/config/mailer.config';
import { LentModule } from 'src/lent/lent.module';
import { CabinetModule } from '../cabinet/cabinet.module';
import { EmailSender } from './email.sender.component';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailerConfigService,
    }),
    CabinetModule,
    LentModule,
  ],

  providers: [EmailSender],
  exports: [EmailSender],
})
export class UtilsModule {}
