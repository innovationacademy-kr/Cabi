import { Controller, Logger } from '@nestjs/common';

@Controller({
  version: '3',
  path: 'api/lent',
})
export class LentController {
  private logger = new Logger(LentController.name);
}
