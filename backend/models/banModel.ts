import mariadb from "mariadb";
import { banUserAddInfo, banUserInfo, overUserInfo } from "./types";

const con = mariadb.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "42cabi_DB",
	dateStrings: true,
});

/**
 * n일 이상 연체자 조회
 *
 * @param days 연체일
 * @return userInfo 리스트 or undefined
 */
export async function getOverUser(days: number): Promise<overUserInfo[] | undefined> {
	let pool: mariadb.PoolConnection;
	let overUserList: overUserInfo[] | undefined = [];
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
			console.error(err);
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
export async function updateUserAuth(userId: number) {
	let pool: mariadb.PoolConnection;
	const content = `
	UPDATE user SET auth = 1 WHERE user_id = ${userId};
	`;

	pool = await con.getConnection();
	await pool
		.query(content)
		.catch((err: any) => {
			console.error(err);
			throw new Error("updateUserAuth Error");
		});
}

/**
 * banUser 조회
 *
 * @param userId 유저 PK
 * @return banUserInfo or undefined
 */
export async function checkBanUser(userId:string): Promise<banUserInfo | undefined> {
	let pool: mariadb.PoolConnection;
	let ban_user: banUserInfo | undefined;
	const content: string = `SELECT * FROM ban_user WHERE user_id = '${userId}' and unBannedDate IS NULL`;

	pool = await con.getConnection();
	ban_user = await pool
		.query(content)
		.then((res: any) => {
			if (!res.length) return undefined
			else {
				return ({
					ban_id: res[0].ban_id,
					user_id: res[0].user_id,
					intra_id: res[0].intra_id,
					cabinet_id: res[0].cabinet_id,
					bannedDate: res[0].bannedDate,
					unBannedDate: res[0].unBannedDate,
				});
			}
		})
		.catch((err: any) => {
			console.error(err);
			throw new Error("CheckBanUser Error");
		});
		if (pool) pool.end();
		return ban_user;
}

/**
 * banUser 추가
 *
 * @param banUser 추가될 유저 정보
 */
export async function addBanUser(banUser: banUserAddInfo) {
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
			console.error(err);
			throw new Error("CheckBanUser Error");
		});
		if (pool) pool.end();
}

/**
 * 캐비넷 activation 변경
 *
 * @param cabinetId 캐비넷 PK
 * @param activation 캐비넷 상태 값
 */
export async function updateCabinetActivation(cabinetId: number, activation: number) {
	let pool: mariadb.PoolConnection;
	const content: string =`
		UPDATE cabinet SET activation = ${activation} WHERE cabinet_id = ${cabinetId}
	`;

	pool = await con.getConnection();
	await pool
		.query(content)
		.catch((err: any) => {
			console.error(err);
			throw new Error("updateCabinetActivation Error");
		});
		if (pool) pool.end();
}
