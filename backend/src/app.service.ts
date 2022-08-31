import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  async test(): Promise<void> {
    console.log(this.configService.get<string>('database.host'));
    console.log(this.configService.get<string>('database.user'));
    console.log(this.configService.get<string>('database.port'));
    console.log(this.configService.get<string>('database.password'));
    console.log(this.configService.get<string>('database.database'));
    console.log(this.configService.get<string>('jwt.secret'));
    console.log(this.configService.get<string>('jwt.expiresIn'));
    console.log(this.configService.get<string>('ftAuth.clientid'));
    console.log(this.configService.get<string>('ftAuth.secret'));
    console.log(this.configService.get<string>('ftAuth.callbackuri'));
    console.log(this.configService.get<string>('email.test'));
  }
}
