import mariadb from "mariadb";
import { con } from "./queryModel";
//슬랙 연체 메세지 발송을 위한 연체 유저 정보 조회
export async function slackOverdueUser(day: string) {
	let pool: mariadb.PoolConnection;
	let intraList: Array<string> = [];
	const content: string = `SELECT intra_id FROM user INNER JOIN lent ON lent.lent_user_id = user.user_id WHERE expire_time='${day}'`;
	pool = await con.getConnection();
	await pool
	  .query(content)
	  .then((res: any) => {
			if (res) {
			  for (let i = 0; i < res.length; i++) {
					intraList.push(res[i].intra_id);
			  }
			}
	  })
	  .catch((err: any) => {
			console.error(err);
			throw err;
	  });
	if (pool) pool.end();
	return intraList;
  }
  
  //슬랙 메세지 발송을 위한 반납 전날 유저 정보 조회
  export async function slackReturnUser(day: string) {
	let pool: mariadb.PoolConnection;
	let intraList: Array<string> = [];
	const content: string = `SELECT intra_id FROM user INNER JOIN lent ON lent.lent_user_id = user.user_id WHERE expire_time='${day}'`;
	pool = await con.getConnection();
	await pool
	  .query(content)
	  .then((res: any) => {
		if (res) {
		  for (let i = 0; i < res.length; i++) {
			intraList.push(res[i].intra_id);
		  }
		}
	  })
	  .catch((err: any) => {
		console.error(err);
		throw err;
	  });
	if (pool) pool.end();
	return intraList;
  }
  