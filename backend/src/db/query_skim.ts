import {user, lent, cabinetList, cabinetInfo, cabinetLent} from '../user'

//사용자 확인 - 사용자가 없는 경우, addUser, 있는 경우, getUser
export async function checkUser(client:any){
	const content:string = `select * from user where user_id = ${user.user_id}`;
	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		console.log(res);
		if (!res.length)
			addUser(client);
		else
			getUser(client);
	})
}

//사용자가 없는 경우, user 값 생성
export async function addUser(client:any){
	const content:string = `insert into user value('${user.user_id}', '${user.intra_id}', '${user.auth}', '${user.email}', '${user.phone}')`;
	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		console.log(res);
	});
}
//본인 정보 및 렌트 정보 - 리턴 페이지
export async function getUser(client:any){
	const content:string = `select * from lent where lent_user_id=${user.user_id}`;
	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		console.log(res);
		console.log(typeof res);
		if (res.length !== 0){ // lent page
			lent.lent_id = res[0].lent_id;
			lent.lent_cabinet_id = res[0].lent_cabinet_id;
			lent.lent_user_id = res[0].lent_user_id;
			lent.lent_time = res[0].lent_time;
			lent.expire_time = res[0].expire_time;
			lent.extension = res[0].extension;
		}
		// console.log(res.length);
	});
}
//lent & user
export async function getLentUser(client:any){
	const content = `select u.intra_id, l.* from user u right join lent l on l.lent_user_id=u.user_id`;
	console.log('getLentUser');
	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		console.log(res);
		for (let i = 0; i < res.length; i++){
			cabinetLent.push(res[i]);
		}
	});
}
//location info
export async function locationInfo(client:any){
	const content:string = `select distinct cabinet.location from cabinet`;

	console.log('location info');
	console.log(client);
	await client.query(content, (err:any, res:any)=>{
		console.log('result~');
		if (err) throw err;
		let i = -1;
		while (res[++i]){
			cabinetList.location?.push(res[i].location);
			floorInfo(client, res[i].location);
		}
		console.log(res);
	});
}
//floor info with exact location
export async function floorInfo(client:any, location:string):Promise<Array<number>>{
	const content:string = `select distinct cabinet.floor from cabinet where location='${location}' order by floor`;
	let floorList:Array<number> = [];
	let list:Array<Array<string>> = [];
	let tmpCabinetList:Array<Array<Array<cabinetInfo>>> = [];

	// console.log('floor info');
	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		let i = -1;
		while (res[++i]){
			floorList.push(res[i].floor);
			// list.push(sectionInfo(client, location, res[i].floor, tmpCabinetList));
			sectionInfo(client, location, res[i].floor, tmpCabinetList).then((value)=> {
				list.push(value);
			});
		}
		cabinetList.floor?.push(floorList);
		cabinetList.section?.push(list);
		cabinetList.cabinet?.push(tmpCabinetList);
		// console.log(floorList);
	});
	return Promise.resolve(floorList);
}
//section info with exact floor
export async function sectionInfo(client:any, location:string, floor:number, list:any):Promise<Array<string>>{
	const content:string = `select distinct cabinet.section from cabinet where location='${location}' and floor=${floor} order by section`;
	let sectionList:Array<string> = [];
	let cabinetList:Array<Array<cabinetInfo>> = [];

	// console.log('section info');
	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		let i = -1;
		while (res[++i]){
			sectionList.push(res[i].section);
			// cabinetList.push(getCabinetInfo(client, location, floor, res[i].section));
			getCabinetInfo(client, location, floor, res[i].section).then((value)=> {
				cabinetList.push(value);
			});
		}
		// console.log(sectionList);
		list.push(cabinetList);
	});
	return Promise.resolve(sectionList);
}
export async function getCabinetInfo(client:any, location:string, floor:number, section:string):Promise<Array<cabinetInfo>>{
	const content:string = `select * from cabinet where location='${location}' and floor=${floor} and section='${section}' and activation=1 order by cabinet_num`;
	let cabinetList:Array<cabinetInfo> = [];

	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		let i = -1;
		while (res[++i]){
			cabinetList.push(res[i]);
		}
		// console.log(cabinetList);
	});
	return cabinetList;
}
//lent 값 생성
export async function createLent(client:any, cabinet_id:number){
	const content:string = `INSERT INTO lent (lent_cabinet_id, lent_user_id, lent_time, expire_time, extension) VALUES (${cabinet_id}, ${user.user_id}, now(), ADDDATE(now(), 30), 0)`;
	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		console.log(res);
	  });
}

//lent_log 값 생성 후 lent 값 삭제 (skim update)
export async function createLentLog(client:any){
	const content:string = `select * from lent where lent_user_id=${user.user_id}`;
	await client.query(content, (err:any, res:any)=>{
		if (err) throw err;
		if (res[0] === undefined)
			return ;
		const lent_id = res[0].lent_id;
		const user_id = res[0].lent_user_id;
		const cabinet_id = res[0].lent_cabinet_id;
		const lent_time = res[0].lent_time;
		client.query(`insert into lent_log (log_user_id, log_cabinet_id, lent_time, return_time) values (${user_id}, ${cabinet_id}, '${lent_time}', now())`);
		client.query(`delete from lent where lent_cabinet_id=${lent_id}`)
		lent.lent_id = -1;
		lent.lent_cabinet_id = -1;
		lent.lent_user_id = -1;
		lent.lent_time = '';
		lent.expire_time = '';
		lent.extension = false;
	});
}

