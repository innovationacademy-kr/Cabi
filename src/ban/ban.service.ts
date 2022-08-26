import { Injectable, Logger } from '@nestjs/common';
import { overUserInfoDto } from './dto/overUserInfo.dto';
import mariadb from 'mariadb';
import { banUserAddInfoDto } from './dto/banUserAddInfo.dto';

const con = mariadb.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "42cabi_DB",
	dateStrings: true,
});

@Injectable()
export class BanService {
	private logger = new Logger(BanService.name);

	/**
	* n일 이상 연체자 조회
	*
	* @param days 연체일
	* @return userInfo 리스트 or undefined
	*/
	async getOverUser(days: number): Promise<overUserInfoDto[] | undefined> {
	let pool: mariadb.PoolConnection;
	let overUserList: overUserInfoDto[] | undefined = [];
	const content: string = `
	SELECT  u.*, l.lent_id, l.lent_cabinet_id
	FROM user u RIGHT OUTER JOIN lent l ON u.user_id = l.lent_user_id
	WHERE DATEDIFF(now(), expire_time) = ${days}`;

	pool = await con.getConnection();
	await pool
		.query(content)
		.then((res:any) => {
			if (!res.length) overUserList = undefined;
			else {
				res.forEach((user: any) => {
					overUserList?.push({
						user_id: user.user_id,
						intra_id: user.intra_id,
						auth: user.auth,
						email: user.email,
						lent_id: user.lent_id,
						cabinet_id: user.lent_cabinet_id,
					})
				});
			}
		})
		.catch((err) => {
			this.logger.error(err);
			throw new Error("getOverUser Error");
		});
		if (pool) pool.end();
		return overUserList;
	}

	/**
	* 유저 권한 ban(1) 으로 변경
	*
	* @param userId 유저 PK
	*/
	async updateUserAuth(userId: number) {
	let pool: mariadb.PoolConnection;
	const content = `
	UPDATE user SET auth = 1 WHERE user_id = ${userId};
	`;

	pool = await con.getConnection();
	await pool
		.query(content)
		.catch((err: any) => {
			this.logger.error(err);
			throw new Error("updateUserAuth Error");
		});
	}

	/**
	 * 캐비넷 activation 변경
	 *
	 * @param cabinetId 캐비넷 PK
	 * @param activation 캐비넷 상태 값
	 */
	async updateCabinetActivation(cabinetId: number, activation: number) {
		let pool: mariadb.PoolConnection;
		const content: string =`
			UPDATE cabinet SET activation = ${activation} WHERE cabinet_id = ${cabinetId}
		`;

		pool = await con.getConnection();
		await pool
			.query(content)
			.catch((err: any) => {
				this.logger.error(err);
				throw new Error("updateCabinetActivation Error");
			});
			if (pool) pool.end();
	}

	/**
	 * banUser 추가
	 *
	 * @param banUser 추가될 유저 정보
	 */
	async addBanUser(banUser: banUserAddInfoDto) {
		let pool: mariadb.PoolConnection;
		const cabinet_id = banUser.cabinet_id ? banUser.cabinet_id : "NULL";
		const content = `
		INSERT INTO ban_user(user_id, intra_id, cabinet_id, bannedDate)
		values (${banUser.user_id}, '${banUser.intra_id}', ${cabinet_id}, now());
		`;

		pool = await con.getConnection();
		await pool
			.query(content)
			.catch((err: any) => {
				this.logger.error(err);
				throw new Error("CheckBanUser Error");
			});
			if (pool) pool.end();
	}
}
