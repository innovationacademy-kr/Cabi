import { Controller, Logger } from '@nestjs/common';

@Controller({
  version: '3',
  path: 'api/user',
})
export class UserController {
  private logger = new Logger(UserController.name);
}
