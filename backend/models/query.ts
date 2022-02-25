import mariadb from 'mariadb'
import { lentInfo, lentCabinetInfo } from './user'

const con = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: '42cabi_DB',
	dateStrings: true
});

//사용자 확인 - 사용자가 없는 경우, addUser, 있는 경우, getUser
export async function checkUser(user: any) {
	let pool: mariadb.PoolConnection;
	let lentCabinet: lentCabinetInfo;
	const content: string = `select * from user where user_id = ${user.user_id}`;

	try {
		pool = await con.getConnection();
		lentCabinet = await pool.query(content).then(async (res: any) => {
			if (!res.length) {
				addUser(user);
				return {
					lent_id: -1,
					lent_cabinet_id: -1,
					lent_user_id: -1,
					lent_time: '',
					expire_time: '',
					extension: false,
					cabinet_num: -1,
					location: '',
					floor: -1,
					section: '',
					activation: false
				};
			} else {
				return await getUser(user);
			}
		});
	} catch (err: any) {
		console.log(err);
		throw err;
	}
	if (pool) pool.end();
	return lentCabinet;
};

//사용자가 없는 경우, user 값 생성
export async function addUser(user: any) {
	let pool: mariadb.PoolConnection;
	const content: string = `insert into user value('${user.user_id}', '${user.intra_id}', 0, '${user.email}', "")`;
	
	pool = await con.getConnection();
	await pool.query(content).then((res: any) => {
		console.log(res);
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
};

//본인 정보 및 렌트 정보 - 리턴 페이지
export async function getUser(user: any): Promise<lentCabinetInfo> {
	let pool: mariadb.PoolConnection;
	let lentCabinet: lentCabinetInfo;
	const content: string = `select * from lent l join cabinet c on l.lent_cabinet_id=c.cabinet_id where l.lent_user_id='${user.user_id}'`;

	pool = await con.getConnection();
	lentCabinet = await pool.query(content).then((res: any) => {
		if (res.length !== 0) { // lent page
			return {
				lent_id: res[0].lent_id,
				lent_cabinet_id: res[0].lent_cabinet_id,
				lent_user_id: res[0].lent_user_id,
				lent_time: res[0].lent_time,
				expire_time: res[0].expire_time,
				extension: res[0].extension,
				cabinet_num: res[0].cabinet_num,
				location: res[0].location,
				floor: res[0].floor,
				section: res[0].section,
				activation: res[0].activation,
			};
		} else {
			return {
				lent_id: -1,
				lent_cabinet_id: -1,
				lent_user_id: -1,
				lent_time: '',
				expire_time: '',
				extension: false,
				cabinet_num: -1,
				location: '',
				floor: -1,
				section: '',
				activation: false
			};
		}
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
	return lentCabinet;
};

//lent & user
export async function getLentUser() {
	let pool: mariadb.PoolConnection;
	let lentInfo: Array<lentInfo> = [];
	const content = 'select u.intra_id, l.* from user u right join lent l on l.lent_user_id=u.user_id';

	pool = await con.getConnection();
	await pool.query(content).then((res: any) => {
		for (let i = 0; i < res.length; i++) {
			lentInfo.push({
				lent_id: res[i].lent_id,
				lent_cabinet_id: res[i].lent_cabinet_id,
				lent_user_id: res[i].lent_user_id,
				lent_time: res[i].lent_time,
				expire_time: res[i].expire_time,
				extension: res[i].extension,
				intra_id: res[i].intra_id,
			});
		}
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
	return { lentInfo: lentInfo };
};

//lent 값 생성
export async function createLent(cabinet_id: number, user: any) {
	let errResult = 0;
	let pool: mariadb.PoolConnection;
	const content: string = `INSERT INTO lent (lent_cabinet_id, lent_user_id, lent_time, expire_time, extension) VALUES (${cabinet_id}, ${user.user_id}, now(), ADDDATE(now(), 7), 0)`;
	
	pool = await con.getConnection();
	await pool.query(content).then((res: any) => {
	}).catch((err: any) => {
		if (err.errno === 1062)
			errResult = -1;
	});
	if (pool) pool.end();
	return { errno: errResult };
};

//lent_log 값 생성 후 lent 값 삭제
export async function createLentLog(user: any) {
	let pool: mariadb.PoolConnection;
	const content: string = `select * from lent where lent_user_id=${user.user_id}`;
	
	pool = await con.getConnection();
	await pool.query(content).then((res: any) => {
		if (res[0] === undefined)
			return;
		pool.query(`insert into lent_log (log_user_id, log_cabinet_id, lent_time, return_time) values (${res[0].lent_user_id}, ${res[0].lent_cabinet_id}, '${res[0].lent_time}', now())`);
		pool.query(`delete from lent where lent_cabinet_id=${res[0].lent_cabinet_id}`);
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
};

export async function activateExtension(user: any) {
	let pool: mariadb.PoolConnection;
	const content: string = `select * from lent where lent_user_id=${user.user_id}`;
	
	pool = await con.getConnection();
	await pool.query(content).then((res:any)=>{
		if (res[0] === undefined){
			return ;
		}
		const content2: string = `update lent set extension=${res[0].extension + 1}, expire_time=ADDDATE(now(), 7) where lent_user_id=${user.user_id}`;
		pool.query(content2);
	}).catch((err:any)=>{
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
}
