import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwtauth.guard';
import { User } from 'src/decorator/user.decorator';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { BetatestService } from './betatest.service';

@ApiTags('베타 테스트용 API (실배포시 구동 X)')
@Controller('api/betatest')
export class BetatestController {
  private logger = new Logger(BetatestController.name);

  constructor(private betatestService: BetatestService) {}

  @ApiOperation({
    summary: '로그인한 사람의 밴 로그 전부 삭제',
    description: '로그인한 사용자의 밴로그를 전부 삭제합니다.',
  })
  @ApiOkResponse({
    description: '초기화 완료',
  })
  @ApiNoContentResponse({
    description: '초기화할 로그가 없을때',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 필요',
  })
  @Delete('deletebanlog')
  @UseGuards(JwtAuthGuard)
  async deleteBanLog(@User() user: UserSessionDto): Promise<string> {
    this.logger.debug(`Called ${this.deleteBanLog.name}`);
    const result = await this.betatestService.deleteBanLog(user.user_id);
    if (result === false) {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }
    return 'ok';
  }
}
