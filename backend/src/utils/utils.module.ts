import { MailerModule } from '@nestjs-modules/mailer';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import MailerConfigService from 'src/config/mailer.config';
import { CabinetModule } from '../cabinet/cabinet.module';
import { LentModule } from '../lent/lent.module';
import { EmailSender } from './email.sender.component';
import { ExpiredChecker } from './expired.checker.component';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailerConfigService,
    }),
    forwardRef(() => LentModule),
    CabinetModule,
  ],

  providers: [EmailSender, ExpiredChecker],
  exports: [EmailSender, ExpiredChecker],
})
export class UtilsModule {}
