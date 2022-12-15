import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Middleware } from './middleware';
import helmet from 'helmet';

@Injectable()
export class SessionMiddleware {
  cookieParser: Middleware;
  helmet: Middleware;

  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    ) {
    this.cookieParser = cookieParser();
    this.helmet = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", configService.get<string>('fe_host')],
          styleSrc: ["'self'", configService.get<string>('fe_host')],
          imgSrc: ["'self'", configService.get<string>('fe_host')],
          fontSrc: ["'self'", configService.get<string>('fe_host')],
          connectSrc: ["'self'", configService.get<string>('fe_host')],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    });
  }
}
