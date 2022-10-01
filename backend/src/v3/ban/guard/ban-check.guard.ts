import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { BanService } from '../ban.service';

/**
 * 사용자가 밴당했는지 확인합니다. 밴 당했을 경우 Forbidden 예외를 발생시킵니다.
 */
@Injectable()
export class BanCheckGuard implements CanActivate {
  private logger = new Logger(BanCheckGuard.name);

  constructor(private banService: BanService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const result = await this.banCheck(req);
    if (result) {
      this.logger.warn('현재 차단당한 상태입니다.');
      throw new ForbiddenException('현재 차단당한 상태입니다.');
    }
    return true;
  }

  private async banCheck(request: Request): Promise<boolean> {
    const user = request.user as UserSessionDto | undefined;
    if (user === undefined) {
      this.logger.debug(`can't find UserSession`);
      return false;
    }
    const ban = await this.banService.isBlocked(user.user_id);
    return ban;
  }
}
