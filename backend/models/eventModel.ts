import mariadb from "mariadb";
import { eventInfo } from "./types";
import { con } from "./queryModel";

// event 정보 추가
export async function insertEventInfo(intra_id:string) {
	let pool: mariadb.PoolConnection;
	const checkContent: string = `select count(*) as count from event where intra_id="${intra_id}"`;
	const insertContent: string = `update event as a, (select * from event where isEvent=false limit 1) as b set a.isEvent=true, a.intra_id="${intra_id}" where a.event_id = b.event_id`;

	pool = await con.getConnection();
	await pool
	.query(checkContent)
	.then(async(res:any) => {
	  if (res[0].count === 0)
	  {
		await pool
		  .query(insertContent)
		  .then((result:any) => {})
		  .catch((err:any) => {
			console.log(err);
			throw err;
		  });
	  }
	  //else {
		//	console.log(`${intra_id} : 이미 이벤트 정보가 있습니다.`);
	  //}
	})
	.catch((err: any) => {
	  console.log(err);
	  throw err;
	})

	if (pool) pool.end();
	return ({ errno: 0 });
  }

  // event 정보 update
export async function updateEventInfo(intra_id:string) {
	let pool: mariadb.PoolConnection;
	const checkContent: string = `select count(*) as count from event where intra_id="${intra_id}"`;
	const updateContent: string = `update 42cabi_DB.event set intra_id = NULL, isEvent=false where intra_id="${intra_id}"`;

	pool = await con.getConnection();
	await pool
	.query(checkContent)
	.then(async(res:any) => {
	  if (res[0].count > 0)
	  {
		await pool
		  .query(updateContent)
		  .then((result:any) => {})
		  .catch((err:any) => {
				console.log(err);
			throw err;
		  });
	  }
	})
	.catch((err: any) => {
	  console.log(err);
	  throw err;
	})

	if (pool) pool.end();
	return ({ errno: 0 });
  }

// event 정보 조회
export async function getEventInfo(intra_id: string){
	let pool: mariadb.PoolConnection;
	let eventInfo: Array<eventInfo> = [];
	const selectContent: string = `select b.* from (select * from event where intra_id="${intra_id}") as a, event as b where b.event_id = a.event_id or b.event_id = a.event_id + if(a.event_id % 2 = 0, - 1, + 1)`;
	pool = await con.getConnection();
	await pool
	  .query(selectContent)
	  .then((res: any) => {
		eventInfo = res;
	  })
	  .catch((err: any) => {
		console.log(err);
		throw err;
	  });
	if (pool) pool.end();
	return ({eventInfo: eventInfo});
}

export async function checkEventInfo(intra_id: string) : Promise<boolean> {
	let pool: mariadb.PoolConnection;
	const selectContent: string = `select count(*) as count from 42cabi_DB.event where intra_id="${intra_id}"`;
	let check: boolean = false;
	pool = await con.getConnection();
	await pool
	  .query(selectContent)
	  .then((res: any) => {
		if (res[0].count > 0) {
			check = true;
		}
		else {
			check = false;
		}
	})
	.catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
	return check;
}

//event 당첨 가능 유무 조회
export async function checkEventLimit() : Promise<boolean> {
	let pool: mariadb.PoolConnection;
	const selectContent: string = `select count(*) as count from 42cabi_DB.event where isEvent=0`;
	let check: boolean = false;
	pool = await con.getConnection();
	await pool
	  .query(selectContent)
	  .then((res: any) => {
		if (res[0].count === 0) {
			check = false;
		}
		else {
			check = true;
		}
	})
	.catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
	return check;
}
