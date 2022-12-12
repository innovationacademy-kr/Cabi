import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Middleware } from './middleware';
import helmet from 'helmet';

@Injectable()
export class SessionMiddleware {
  cookieParser: Middleware;
  helmet: Middleware;

  constructor(private configService: ConfigService) {
    this.cookieParser = cookieParser();
    this.helmet = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", process.env.FE_HOST],
          styleSrc: ["'self'", process.env.FE_HOST],
          imgSrc: ["'self'", process.env.FE_HOST],
          fontSrc: ["'self'", process.env.FE_HOST],
          connectSrc: ["'self'", process.env.FE_HOST],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    });
  }
}
