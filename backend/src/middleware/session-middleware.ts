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
    this.helmet = helmet({ contentSecurityPolicy: false });
  }
}
