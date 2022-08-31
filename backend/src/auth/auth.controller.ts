import { Controller, Get, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/guard/jwtauth.guard';
import { Response } from 'express';
import { FtGuard } from './42/guard/ft.guard';
import { UserSessionDto } from './dto/user.session.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JWTSignGuard } from './jwt/guard/jwtsign.guard';
import { User } from './user.decorator';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '42 로그인',
    description:
      '42 OAuth 로그인 요청, 성공시 login/callback으로 리다이렉트합니다.',
  })
  @Get('login')
  @UseGuards(FtGuard)
  login() {
    this.logger.log('Login'); // NOTE: can't reach this point
  }

  @ApiOperation({
    summary: '로그인 콜백',
    description:
      '42 OAuth 로그인 성공시 호출 되며 유저의 렌트 여부에 따라 return / lent로 리다이렉트합니다.',
  })
  @Get('login/callback')
  @UseGuards(FtGuard, JWTSignGuard)
  async loginCallback(@Res() res: Response, @User() user: UserSessionDto) {
    this.logger.log('Login -> callback');

    const lentCabinet = await this.authService.checkUser(user);
    if (lentCabinet.lent_id !== -1) {
      return res.redirect('/return');
    }
    return res.redirect('/lent');
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 수행합니다.',
  })
  // FIXME: front 코드에서는 logout 버튼을 누르면 post를 줌. 둘 중 하나를 고쳐야할 것 같습니다.
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response, @User() user: UserSessionDto) {
    this.logger.log(`${user.intra_id} logged out`);
    // NOTE: 토큰을 쿠키에 저장하지 않는다면 다른 로그아웃 방식을 고안해야 함. (세션을 블랙리스트 캐시에 추가하거나...)
    res.clearCookie('accessToken');
    res.redirect('/');
  }
}
