import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CabinetModule } from './cabinet/cabinet.module';
import { BanModule } from './ban/ban.module';
import configuration from './config/configuration';
import { SessionMiddleware } from './middleware/session-middleware';
import { join } from 'path';
import { MailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { BlackholeModule } from './blackhole/blackhole.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // TODO: remove after
    }),
    CabinetModule,
    BanModule,
    AuthModule,
    MailModule,
    EventModule,
    BlackholeModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend/dist/'),
      // serveRoot: '../img'
    }),
    UserModule,
  ],
  controllers: [],
  providers: [SessionMiddleware],
})
export class AppModule implements NestModule {
  constructor(public sessionMiddleware: SessionMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    // NOTE: JWT 토큰이 쿠키에 저장되기 때문에 모든 경로에 대해 해당 미들웨어 적용
    consumer.apply(this.sessionMiddleware.cookieParser).forRoutes('*');
  }
}
