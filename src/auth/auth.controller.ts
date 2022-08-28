import { Controller, Get, Logger, Res, UseGuards } from '@nestjs/common';
import { FtGuard } from './42/guard/ft.guard';
import { JWTSignGuard } from './jwtsign.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  @Get('login')
  @UseGuards(FtGuard)
  ftLogin() {
    this.logger.log('Login');
  }

  @Get('login/callback')
  @UseGuards(FtGuard, JWTSignGuard)
  ftLoginCallback() {
    this.logger.log('Login -> callback');
    return 'ok';
  }
}
