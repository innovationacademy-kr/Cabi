import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Injectable()
export default class MailerConfigService implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        service: this.configService.get('email.service'),
        host: this.configService.get('email.host'),
        port: 465,
        auth: {
          user: this.configService.get('email.user'),
          pass: this.configService.get('email.pass'),
        },
        secure: true,
        tls: {
          maxVersion: this.configService.get('email.tls.maxVersion'),
          minVersion: this.configService.get('email.tls.minVersion'),
          ciphers: this.configService.get('email.tls.ciphers'),
        },
      },
      template: {
        dir: path.join(__dirname, '../v3/utils/templates/'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
