import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CabinetModule } from './cabinet/cabinet.module';
import { BanModule } from './ban/ban.module';
import db_configuration from './config/db-configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [db_configuration],
      isGlobal: true, // TODO: remove after
    }),
    CabinetModule,
    BanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
