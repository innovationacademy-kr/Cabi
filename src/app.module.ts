import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CabinetModule } from './cabinet/cabinet.module';
import configuration from './config/configuration';
import { SessionMiddleware } from './middleware/session-middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // TODO: remove after
    }),
    CabinetModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, SessionMiddleware],
})
export class AppModule implements NestModule {
  constructor(public sessionMiddleware: SessionMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    // NOTE: JWT 토큰이 쿠키에 저장되기 때문에 모든 경로에 대해 해당 미들웨어 적용
    consumer.apply(this.sessionMiddleware.cookieParser).forRoutes('*');
  }
}
