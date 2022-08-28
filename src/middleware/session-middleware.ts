import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Middleware } from './middleware';

@Injectable()
export class SessionMiddleware {
  cookieParser: Middleware;

  constructor(private configService: ConfigService) {
    this.cookieParser = cookieParser();
  }
}
