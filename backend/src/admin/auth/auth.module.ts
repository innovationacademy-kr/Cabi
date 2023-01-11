import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthController } from './auth.controller';
import { AdminJwtStrategy } from './jwt/jwt.strategy';
import { AdminAuthRepository } from './repository/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleStrategy } from 'src/admin/auth/google/google.strategy';
import AdminUser from 'src/entities/admin.user.entity';
import { AdminAuthService } from './auth.service';

const adminAuthRepo = {
  provide: 'IAdminAuthRepository',
  useClass: AdminAuthRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
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
  providers: [AdminJwtStrategy, AdminAuthService, adminAuthRepo, GoogleStrategy],
  controllers: [AdminAuthController],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
