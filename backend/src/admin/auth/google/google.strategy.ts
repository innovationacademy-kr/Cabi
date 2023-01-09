import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AdminUserDto } from 'src/admin/dto/admin.user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('admin.clientid'),
      clientSecret: configService.get<string>('admin.secret'),
      callbackURL: configService.get<string>('admin.callbackurl'),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails } = profile;
    const adminUser: AdminUserDto = {
      email: emails[0].value,
      role: 0,
    };
    done(null, adminUser);
  }
}
