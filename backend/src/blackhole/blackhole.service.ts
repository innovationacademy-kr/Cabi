import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BlackholeService {
	private client_id: string;
	private client_secret: string;
	private postConfig: AxiosRequestConfig;

	constructor(
		private readonly httpService: HttpService,
		@Inject(ConfigService) private configService: ConfigService
	) {
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

	async getBlackholeInfo(token: string) {
		const url = 'https://api.intra.42.fr/v2/users/yoyoo';
		const headersRequest = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		};
		// console.log(token);
		// console.log(headersRequest);
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
			const LearnerBlackhole: Date = new Date(data.cursus_users[1].blackholed_at);
			const today = new Date();
			// blackholed_at이 null이 아닌 경우
			if (LearnerBlackhole) {
				console.log('Blackhole_day: ', LearnerBlackhole);
				console.log('Today: ', today);
				if (LearnerBlackhole >= today) {
					console.log('not fall into a black hole');
				} else {
					console.log('fall into a black hole');
				}
			} else {
				console.log('You are Member');
			}
		})
		.catch((err) => {
			throw new HttpException(err.response.statusText, HttpStatus.NOT_FOUND);
		});
	}

	@Cron(CronExpression.EVERY_5_SECONDS)
	async postOauthToken() {
		const url = 'https://api.intra.42.fr/oauth/token';
		// this.httpService.post(url, null, this.postConfig)
		await firstValueFrom(
			await this.httpService.post(url, null, this.postConfig)
			.pipe(
				map((res) => res.data),
			)
		)
		// .then((data) => console.log(data))
		.then((data) => this.getBlackholeInfo(data.access_token))
	}
}
