import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export default class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const log = this.configService.get<boolean>('debug.log');

    //TODO: v4 개발을 위한 코드입니다. database가 완전히 바뀐 후에는 수정이 필요합니다.
    const local = this.configService.get<boolean>('is_local');
    let db = this.configService.get<string>('database.database');
    if (local) 
      db = this.configService.get<string>('database.database_v4');
    
    return {
      type: 'mysql',
      host: this.configService.get<string>('database.host'),
      username: this.configService.get<string>('database.user'),
      port: this.configService.get<number>('database.port'),
      password: this.configService.get<string>('database.password'),
      database: db,
      entities: [`${__dirname}/../**/entities/*.entity.{js,ts}`],
      synchronize: false,
      logging: log,
    };
  }
}
