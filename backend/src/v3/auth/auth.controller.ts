import { Controller, Logger } from '@nestjs/common';

@Controller({
  version: '3',
  path: 'api/auth',
})
export class AuthController {
  private logger = new Logger(AuthController.name);
}
