import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FtStrategy } from './42/ft.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthService } from './auth.service';
import { TypeormAuthRepository } from './repository/typeorm.auth.repository';
import User from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const repo = {
  provide: 'IAuthRepository',
  useClass: TypeormAuthRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  exports: [AuthService],
})
export class AuthModule {}
