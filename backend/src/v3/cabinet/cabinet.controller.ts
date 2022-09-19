import { Controller, Logger } from '@nestjs/common';

@Controller({
  version: '3',
  path: 'api/cabinet',
})
export class CabinetController {
  private logger = new Logger(CabinetController.name);
}
