import mariadb from 'mariadb'
import {user, lent, lentCabinet, cabinetList, cabinetInfo, cabinetLent} from '../user'

//사용자 확인 - 사용자가 없는 경우, addUser, 있는 경우, getUser
export async function checkUser(client:mariadb.PoolConnection){
	const content:string = `select * from user where user_id = ${user.user_id}`;
	await client.query(content).then(async (res:any)=>{
		console.log(res);
		if (!res.length)
			await addUser(client);
		else
			await getUser(client);
	}).catch((err:any)=>{
		console.log(err);
		throw err;
	});
}

//사용자가 없는 경우, user 값 생성
export function addUser(client:mariadb.PoolConnection){
	console.log('addUser');
	const content:string = `insert into user value('${user.user_id}', '${user.intra_id}', ${user.auth}, '${user.email}', '${user.phone}')`;
	client.query(content).then((res:any)=>{
		console.log(res);
	}).catch((err:any)=>{
		console.log(err);
		throw err;
	});
}
//본인 정보 및 렌트 정보 - 리턴 페이지
export async function getUser(client:mariadb.PoolConnection){
	console.log('getUser')
	const content:string = `select * from lent l join cabinet c on l.lent_cabinet_id=c.cabinet_id where l.lent_user_id='${user.user_id}'`;
	await client.query(content).then((res:any)=>{
		if (res.length !== 0){ // lent page
			lentCabinet.lent_id = res[0].lent_id;
			lentCabinet.lent_cabinet_id = res[0].lent_cabinet_id;
			lentCabinet.lent_user_id = res[0].lent_user_id;
			lentCabinet.lent_time = res[0].lent_time;
			lentCabinet.expire_time = res[0].expire_time;
			lentCabinet.extension = res[0].extension;
			lentCabinet.cabinet_num = res[0].cabinet_num;
			lentCabinet.location = res[0].location;
			lentCabinet.floor = res[0].floor;
			lentCabinet.section = res[0].section;
			lentCabinet.activation = res[0].activation;
		}
		else{
			lentCabinet.lent_id = -1,
			lentCabinet.lent_cabinet_id = -1,
			lentCabinet.lent_user_id = -1,
			lentCabinet.lent_time = '',
			lentCabinet.expire_time = '',
			lentCabinet.extension = false,
			lentCabinet.cabinet_num = -1,
			lentCabinet.location = '',
			lentCabinet.floor = -1,
			lentCabinet.section = '',
			lentCabinet.activation = false
		}
		console.log('lentCabinet.lent_id');
		console.log(lentCabinet.lent_id);
	}).catch((err:any)=>{
		console.log(err);
		throw err;
	});
}
//lent & user
export async function getLentUser(client:mariadb.PoolConnection){
	const content = `select u.intra_id, l.* from user u right join lent l on l.lent_user_id=u.user_id`;
	console.log('getLentUser');
	await client.query(content).then((res:any)=>{
		console.log('res.length');
		cabinetLent.splice(0, cabinetLent.length);
		console.log(res.length);
		for (let i = 0; i < res.length; i++){
			cabinetLent.push(res[i]);
		}
	}).catch((err:any)=>{
		console.log(err);
		throw err;
	});
}
//location info
export function locationInfo(client:mariadb.PoolConnection){
	const content:string = `select distinct cabinet.location from cabinet`;

	// console.log('location info');
	const result:any = client.query(content);
	result.forEach(async (element:any)=>{
		cabinetList.location?.push(result.location);
		floorInfo(client, result.location);
	});
}
//floor info with exact location
export function floorInfo(client:mariadb.PoolConnection, location:string):Array<number>{
	const content:string = `select distinct cabinet.floor from cabinet where location='${location}' order by floor`;
	let floorList:Array<number> = [];
	let list:Array<Array<string>> = [];
	let tmpCabinetList:Array<Array<Array<cabinetInfo>>> = [];

	// console.log('floor info');
	const result:any = client.query(content);
	result.forEach(async (element:any)=>{
		floorList.push(result.floor);
	 	list.push(sectionInfo(client, location, element.floor, tmpCabinetList));
	});
	cabinetList.floor?.push(floorList);
	cabinetList.section?.push(list);
	cabinetList.cabinet?.push(tmpCabinetList);
	return floorList;
}
//section info with exact floor
export function sectionInfo(client:mariadb.PoolConnection, location:string, floor:number, list:any):Array<string>{
	const content:string = `select distinct cabinet.section from cabinet where location='${location}' and floor=${floor} order by section`;
	let sectionList:Array<string> = [];
	let cabinetList:Array<Array<cabinetInfo>> = [];

	// console.log('section info');
	const result:any = client.query(content);
	result.forEach(async (element:any)=>{
	 	sectionList.push(result.section);
	 	cabinetList.push(getCabinetInfo(client, location, floor, result.section));
	})
	list.push(cabinetList);
	return sectionList;
}
export function getCabinetInfo(client:mariadb.PoolConnection, location:string, floor:number, section:string):Array<cabinetInfo>{
	const content:string = `select * from cabinet where location='${location}' and floor=${floor} and section='${section}' and activation=1 order by cabinet_num`;
	let cabinetList:Array<cabinetInfo> = [];

	const result:any = client.query(content);
	result.forEach((element:any)=>{
		cabinetList.push(element);
	});
	return cabinetList;
}
//lent 값 생성
export function createLent(client:mariadb.PoolConnection, cabinet_id:number){
	const content:string = `INSERT INTO lent (lent_cabinet_id, lent_user_id, lent_time, expire_time, extension) VALUES (${cabinet_id}, ${user.user_id}, now(), ADDDATE(now(), 30), 0)`;
	client.query(content).then((res:any)=>{
		console.log(res);
	  }).catch((err:any)=>{
		  console.log(err);
		  throw err;
	  });
}

//lent_log 값 생성 후 lent 값 삭제
export async function createLentLog(client:mariadb.PoolConnection){
	const content:string = `select * from lent where lent_user_id=${user.user_id}`;
	await client.query(content).then((res:any)=>{
		if (res[0] === undefined)
			return ;
		const lent_id = res[0].lent_id;
		const user_id = res[0].lent_user_id;
		const cabinet_id = res[0].lent_cabinet_id;
		const lent_time = res[0].lent_time;
		client.query(`insert into lent_log (log_user_id, log_cabinet_id, lent_time, return_time) values (${user_id}, ${cabinet_id}, '${lent_time}', now())`);
		client.query(`delete from lent where lent_cabinet_id=${cabinet_id}`)
		lentCabinet.lent_id = -1;
		lentCabinet.lent_cabinet_id = -1;
		lentCabinet.lent_user_id = -1;
		lentCabinet.lent_time = '';
		lentCabinet.expire_time = '';
		lentCabinet.extension = false;
		lentCabinet.cabinet_num = -1;
		lentCabinet.location = '';
		lentCabinet.floor = -1;
		lentCabinet.section = '';
		lentCabinet.activation = false;
	}).catch((err:any)=>{
		console.log(err);
		throw err;
	});
}
