import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './email.service';
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BanService } from '../ban/ban.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BanService,
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          // service: process.env.MAIL_SERVICE,
          host: process.env.MAIL_HOST,
          port: 465,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
          secure: true,
          template: {
            dir: path.join(__dirname, './templates/'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          // nestjs에서도 사용하는 옵션인가요..?
          // tls: {
          //     maxVersion: process.env.MAIL_TLS_MAXVERSION,
          //     minVersion: process.env.MAIL_TLS_MINVERSION,
          //     ciphers: process.env.MAIL_TLS_CIPHERS,
          // }
        },
      }),
    }),
  ],

  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
