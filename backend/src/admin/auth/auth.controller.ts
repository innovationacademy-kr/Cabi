import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { User } from '../../decorator/user.decorator';
import { AdminJWTSignGuard } from './jwt/guard/jwtsign.guard';
import { AdminJwtAuthGuard } from './jwt/guard/jwtauth.guard';
import { GoogleOAuthGuard } from 'src/admin/auth/google/guard/google.guard';
import { AdminUserDto } from '../dto/admin.user.dto';
import { AdminAuthService } from './auth.service';
import { GoogleAuthFilter } from 'src/admin/auth/google/google.auth.filter';
import { AdminLoginDto } from '../dto/admin.login.dto';

@ApiTags('Auth')
@Controller('/api/admin/auth')
export class AdminAuthController {
  private logger = new Logger(AdminAuthController.name);
  constructor(
    private adminAuthService: AdminAuthService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: '구글 로그인에 대한 요청입니다.',
    description:
      '로그인을 하고자 할 때 해당 URI로 접근해야 합니다. 접근하면 자동으로 google OAuth 인증을 수행하며 인증이 완료되면 auth/login/callback 으로 리다이렉트 해줍니다.',
  })
  @ApiFoundResponse({
    description: 'google OAuth 페이지로 리다이렉트',
  })
  @Get('/login')
  @UseGuards(GoogleOAuthGuard)
  async loginGoogle(@Req() req) {
    this.logger.log('Logged in Google OAuth!');
  }

  @Post('/login')
  async login(
    @Body(new ValidationPipe()) loginInfo: AdminLoginDto,
    @Res() res: Response,
  ): Promise<void> {
    if (!(await this.adminAuthService.isAdminLoginVerified(loginInfo))) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }
    const token = await this.adminAuthService.generateAdminJWTToken();

    res.cookie('admin_access_token', token);
    this.logger.log(`Admin has logged in.`);
    res.status(HttpStatus.OK).send();
  }

  @ApiOperation({
    summary: 'intra 로그인 시도 후 처리에 대한 요청입니다.',
    description:
      'intra 로그인 시도 후 OAuth 인증이 완료되면 해당 URI로 자동으로 리다이렉트 됩니다. 정상적으로 인증이 완료되었다면 쿠키에 JWT 토큰을 심으며 사용자의 사물함 대여 여부에 따라 리다이렉트를 해줍니다.',
  })
  @ApiFoundResponse({
    description:
      '정상적으로 인증이 완료되었다면 main 또는 lent로 리다이렉트 합니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '토큰 에러, 키 에러, 기타 에러 발생 시',
  })
  @Get('login/callback')
  @UseGuards(GoogleOAuthGuard, AdminJWTSignGuard)
  @UseFilters(GoogleAuthFilter)
  async loginCallback(@Res() res: Response, @User() adminUser: AdminUserDto) {
    this.logger.log(`${adminUser.email} has logged in.`);
    return res.redirect(
      `${this.configService.get<string>('fe_host')}/admin/home`,
    );
  }

  @ApiOperation({
    summary: 'cabi에서 로그아웃을 합니다 (JWT 세션 제거)',
    description:
      'cabi에서 로그아웃을 할 때 호출합니다. 호출 시 쿠키 내의 accessToken 을 제거합니다.',
  })
  @ApiNoContentResponse({
    description: '로그아웃 성공',
  })
  @ApiUnauthorizedResponse({
    description: '이미 로그아웃 상태거나 JWT 세션이 만료됨',
  })
  @Get('logout')
  @UseGuards(AdminJwtAuthGuard)
  @HttpCode(204)
  logout(@Res() res: Response, @User() adminUser: AdminUserDto) {
    this.logger.log(`${adminUser.email} logged out`);
    // NOTE: 토큰을 쿠키에 저장하지 않는다면 다른 로그아웃 방식을 고안해야 함. (세션을 블랙리스트 캐시에 추가하거나...)
    res.clearCookie('access_token');
    res.send();
  }
}
