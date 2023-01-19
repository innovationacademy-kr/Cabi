import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch(ForbiddenException)
  export class GoogleAuthFilter implements ExceptionFilter {
    private logger = new Logger(GoogleAuthFilter.name);
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      
      response.status(status).redirect('api/admin/auth/login/failure');
    }
  }
  