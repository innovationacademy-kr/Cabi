import mariadb from "mariadb";
import { banUserInfo, overUserInfo, userInfo, userList } from "./types";

const con = mariadb.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "42cabi_test",
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
	let overUserList: overUserInfo[] | undefined;
	const content: string = `
	SELECT  u.*, cabinet_id
	FROM USER u RIGHT OUTER JOIN lent l ON u.user_id = l.lent_user_id
	WHERE DATEDIFF(now(), expire_time) = ${days}`;

	pool = await con.getConnection();
	await pool
		.query(content)
		.then((res:any) => {
			if (!res.length) overUserList = undefined;
			else {
				res.forEach((user) => {
					overUserList?.push({
						user_id: user.user_id,
						intra_id: user.intra_id,
						auth: user.auth,
						email: user.email,
						cabinet_id: user.cabinet_id,
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
 * banUser 조회
 *
 * @param userId 유저 PK
 * @return banUserInfo or undefined
 */
export async function checkBanUser(userId:string): Promise<banUserInfo | undefined> {
	let pool: mariadb.PoolConnection;
	let ban_user: banUserInfo | undefined;
	const content: string = `SELECT * FROM ban WHERE user_id = '${userId}' and unBannedDate IS NULL`;

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
