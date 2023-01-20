import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class FtAuthFilter implements ExceptionFilter {
    constructor(
        @Inject(ConfigService)
        private configService: ConfigService,
    ){}
    catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status)
    .redirect(`${this.configService.get<string>('FE_HOST')}/login/failure`);
  }
}
