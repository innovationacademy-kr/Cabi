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
    // d3qnuh6xe167gf.cloudfront.net에서 오는 요청은 예외적으로 허용
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", process.env.FE_HOST_DEV],
        styleSrc: ["'self'", process.env.FE_HOST_DEV],
        imgSrc: ["'self'", process.env.FE_HOST_DEV],
        fontSrc: ["'self'", process.env.FE_HOST_DEV],
        connectSrc: ["'self'", process.env.FE_HOST_DEV],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    });
  }
}
