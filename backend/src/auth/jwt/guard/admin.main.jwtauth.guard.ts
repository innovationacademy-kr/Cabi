import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AdminMainAuthGuard extends AuthGuard(['admin_jwt', 'jwt']) {
	handleRequest<TUser = any>(err: any, user: any): TUser {
		if (err || !user) {
		  throw (
			err ||
			new UnauthorizedException(
			  '🚨 아무런 토큰이 없습니다. 🥲 🚨\n다시 로그인해주세요.',
			)
		  );
		}
		return user;
	  }
}