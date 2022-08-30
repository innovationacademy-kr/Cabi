import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { BanService } from '../ban.service';

/**
 * 사용자가 밴당했는지 확인합니다. 밴 당했을 경우 Unauthorized 예외를 발생시킵니다.
 */
@Injectable()
export class BanCheckGuard implements CanActivate {
  private logger = new Logger(BanCheckGuard.name);

  constructor(private banService: BanService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const result = await this.banCheck(req);
    if (result === false) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private async banCheck(request: Request): Promise<boolean> {
    const user = request.user as UserSessionDto | undefined;
    if (user === undefined) {
      this.logger.debug(`can't find UserSession`);
      return false;
    }
    const ban = await this.banService.checkBannedUserList(user.user_id);
    return ban === 0;
  }
}
