import { MailerModule } from '@nestjs-modules/mailer';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import MailerConfigService from 'src/config/mailer.config';
import { LentModule } from 'src/lent/lent.module';
import { CabinetModule } from '../cabinet/cabinet.module';
import { DateCalculator } from './date.calculator.component';
import { EmailSender } from './email.sender.component';
import { ExpiredChecker } from './expired.checker.component';
import { LeaveAbsence } from './leave.absence.component';
import { Scheduling } from './scheduling.component';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailerConfigService,
    }),
    CabinetModule,
    forwardRef(() => LentModule),
  ],

  providers: [EmailSender, ExpiredChecker, DateCalculator, LeaveAbsence, Scheduling],
  exports: [EmailSender, DateCalculator],
})
export class UtilsModule {}
