import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IBlackholeRepository } from './repository/blackhole.repository';

@Injectable()
export class BlackholeService {
	private client_id: string;
	private client_secret: string;
	private postConfig: AxiosRequestConfig;
	private logger: Logger;

	constructor(
		private blackholeRepository: IBlackholeRepository,
		private readonly httpService: HttpService,
		@Inject(ConfigService) private configService: ConfigService
	) {
		this.logger = new Logger(BlackholeService.name);
		this.client_id = this.configService.get<string>('ftAuth.clientid');
		this.client_secret = this.configService.get<string>('ftAuth.secret');
		this.postConfig = {
			params: {
				grant_type: 'client_credentials',
				client_id: `${this.client_id}`,
				client_secret: `${this.client_secret}`,
			}
		};
	}

	async deleteBlackholedUser(intra_id: string) {
		try {
			console.log(`delete ${intra_id}`);
			this.blackholeRepository.deleteBlackholedUser(intra_id);
		  } catch (err) {
			// this.logger.error(err);
			console.log(err);
		  }
	}

	async getBlackholeInfo(token: string) {
		const url = 'https://api.intra.42.fr/v2/users/yoyoo';
		const headersRequest = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		};
		await firstValueFrom(
			await this.httpService.get(url, { headers: headersRequest })
			.pipe(
				map((res) => res.data),
			)
		)
		.then((data) => {
			// 존재하는 유저인지 먼저 필터링
			// cursus_users 0 => Piscine
			// cursus_users 1 => Learner
			// blackholed_at이 null이면 Member로 판단.
			// blackholed_at이 Now()보다 작으면 블랙홀에 빠진것으로 판단.
			// cursus_users 2 => Member

			// get Learner info blackholed_at
			console.log(data.id);
			const intra_id = data.login;
			const LearnerBlackhole: Date = new Date(data.cursus_users[1].blackholed_at);
			const today = new Date();
			// blackholed_at이 null이 아닌 경우
			if (LearnerBlackhole) {
				console.log('Blackhole_day: ', LearnerBlackhole);
				console.log('Today: ', today);
				if (LearnerBlackhole >= today) {
					console.log(`${intra_id} not fall into a black hole`);
				} else {
					console.log(`${intra_id} fall into a black hole`);
					this.deleteBlackholedUser(intra_id);
				}
			} else {
				console.log(`${intra_id} is Member`);
			}
		})
		.catch((err) => {
			throw new HttpException(err.response.statusText, HttpStatus.NOT_FOUND);
		});
	}

	@Cron(CronExpression.EVERY_5_SECONDS)
	async postOauthToken() {
		const url = 'https://api.intra.42.fr/oauth/token';
		await firstValueFrom(
			await this.httpService.post(url, null, this.postConfig)
			.pipe(
				map((res) => res.data),
			)
		)
		.then((data) => {
			this.getBlackholeInfo(data.access_token);
		})
	}
}
