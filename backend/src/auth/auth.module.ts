import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FtStrategy } from './42/ft.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthService } from './auth.service';
import { IAuthRepository } from './repository/auth.repository';
import { RawqueryAuthRepository } from './repository/rawquery.auth.repository';

const repo = {
  provide: IAuthRepository,
  useClass: RawqueryAuthRepository,
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FtStrategy, JwtStrategy, AuthService, repo],
  controllers: [AuthController],
})
export class AuthModule {}
