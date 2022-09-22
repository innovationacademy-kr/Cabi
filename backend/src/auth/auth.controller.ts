import { Controller, Get, Logger, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/guard/jwtauth.guard';
import { Response } from 'express';
import { FtGuard } from './42/guard/ft.guard';
import {
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTSignGuard } from './jwt/guard/jwtsign.guard';
import { User } from './user.decorator';
import { AuthService } from './auth.service';
import { UserSessionDto } from 'src/dto/user.session.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'intra 로그인에 대한 요청입니다.',
    description:
      '로그인을 하고자 할 때 해당 URI로 접근해야 합니다. 접근하면 자동으로 42 OAuth 인증을 수행하며 인증이 완료되면 auth/login/callback 으로 리다이렉트 해줍니다.',
  })
  @ApiFoundResponse({
    description: '42 OAuth 페이지로 리다이렉트',
  })
  @Get('login')
  @UseGuards(FtGuard)
  login() {
    this.logger.log('Login'); // NOTE: can't reach this point
  }

  @ApiOperation({
    summary: 'intra 로그인 시도 후 처리에 대한 요청입니다.',
    description:
      'intra 로그인 시도 후 OAuth 인증이 완료되면 해당 URI로 자동으로 리다이렉트 됩니다. 정상적으로 인증이 완료되었다면 쿠키에 JWT 토큰을 심으며 사용자의 사물함 대여 여부에 따라 리다이렉트를 해줍니다.',
  })
  @ApiFoundResponse({
    description:
      '정상적으로 인증이 완료되었다면 cabinet_info 또는 my_lent_info로 리다이렉트 합니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '토큰 에러, 키 에러, 기타 에러 발생 시',
  })
  @Get('login/callback')
  @UseGuards(FtGuard, JWTSignGuard)
  async loginCallback(@Res() res: Response, @User() user: UserSessionDto) {
    this.logger.log('Login -> callback');
    // NOTE: 42 계정이 존재하면 무조건 로그인 처리를 할것이므로 계정 등록도 여기서 처리합니다.
    const join = await this.authService.addUserIfNotExists(user);
    if (!join) {
      return res.redirect('/cabinet_info');
    }
    const lent = await this.authService.checkUserBorrowed(user);
    if (!lent) {
      return res.redirect('/cabinet_info');
    }
    return res.redirect('/my_lent_info');
  }

  @ApiOperation({
    summary: 'cabi에서 로그아웃을 합니다 (JWT 세션 제거)',
    description:
      'cabi에서 로그아웃을 할 때 호출합니다. 호출 시 쿠키 내의 accessToken 을 제거합니다.',
  })
  @ApiFoundResponse({
    description: '로그아웃 성공시 메인 페이지로 리다이렉트',
  })
  @ApiUnauthorizedResponse({
    description: '로그아웃 상태거나 JWT 세션이 만료됨',
  })
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response, @User() user: UserSessionDto) {
    this.logger.log(`${user.intra_id} logged out`);
    // NOTE: 토큰을 쿠키에 저장하지 않는다면 다른 로그아웃 방식을 고안해야 함. (세션을 블랙리스트 캐시에 추가하거나...)
    res.clearCookie('accessToken');
    res.redirect('/');
  }
}
