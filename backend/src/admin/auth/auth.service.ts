import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IAdminAuthRepository } from './repository/auth.repository.interface';
import { ConfigService } from '@nestjs/config';
import { AdminUserDto } from '../dto/admin.user.dto';
import AdminUserRole from 'src/admin/enums/admin.user.role.enum';
import { AdminLoginDto } from '../dto/admin.login.dto';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';

@Injectable()
export class AdminAuthService {
  private logger = new Logger(AdminAuthService.name);
  constructor(
    @Inject('IAdminAuthRepository')
    private adminAuthRepository: IAdminAuthRepository,
    @Inject(JwtService)
    private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addUserIfNotExists(adminUser: AdminUserDto): Promise<boolean> {
    this.logger.debug(
      `Called ${AdminAuthService.name} ${this.addUserIfNotExists.name}`,
    );
    const find = await this.adminAuthRepository.addUserIfNotExists(adminUser);
    await this.cacheManager.set(`user-${adminUser.email}`, true, { ttl: 0 });
    return find;
  }

  async checkUserExists(email: string): Promise<boolean> {
    this.logger.debug(
      `Called ${AdminAuthService.name} ${this.checkUserExists.name}`,
    );
    const exist = await this.cacheManager.get<boolean>(`admin_user-${email}`);
    if (exist === undefined) {
      const result = await this.adminAuthRepository.checkUserExists(email);
      await this.cacheManager.set(`admin_user-${email}`, result, { ttl: 0 });
      return result;
    }
    return exist;
  }

  async getAdminUserRole(email: string): Promise<AdminUserRole> {
    this.logger.debug(
      `Called ${AdminAuthService.name} ${this.getAdminUserRole.name}`,
    );
    const result = await this.adminAuthRepository.getAdminUserRole(email);
    return result;
  }

  async isAdminLoginVerified(loginInfo: AdminLoginDto) {
    return (
      loginInfo.id === this.configService.get<string>('admin.login_id') &&
      loginInfo.password ===
        this.configService.get<string>('admin.login_password')
    );
  }

  async generateAdminJWTToken(res: Response) {
    const adminPayload: AdminUserDto = {
      email: 'admin@innovationacademy.kr',
      role: AdminUserRole.ROOT_ADMIN,
    };

    const token = this.jwtService.sign(adminPayload);

    if (this.configService.get<boolean>('is_local') === true) {
      res.cookie('admin_access_token', token);
    } else {
      const expires = new Date(this.jwtService.decode(token)['exp'] * 1000);
      const cookieOptions: CookieOptions = {
        expires,
        httpOnly: false,
        domain: 'cabi.42seoul.io',
      };
      res.cookie('admin_access_token', token, cookieOptions);
    }
  }
}
