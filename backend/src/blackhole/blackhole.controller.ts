import { Controller, Get, Request, Res } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, tap } from 'rxjs';
import { BlackholeService } from './blackhole.service';

@Controller('blackhole')
export class BlackholeController {
	private access_token: string;
	constructor(private blackholeService: BlackholeService) {}

	@Get('test')
	async test(@Res() res: Response) {
		const result = await this.blackholeService.postOauthToken();
		return result;
	}
}
