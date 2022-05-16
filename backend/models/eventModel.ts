import mariadb from "mariadb";
import { eventInfo } from "./userModel";
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
export async function getEventInfo(intra_id: string) {
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
