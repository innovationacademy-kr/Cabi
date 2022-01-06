const mysqlssh = require('mysql-ssh')
import {user, lent, lentForPost, cabinet, locationInfo} from '../user'

//사용자 확인 - 사용자가 없는 경우, addUser, 있는 경우, getUser
export function checkUser(client:any){
    client.query(`select * from user where user_id = ${user.user_id}`, function(err:any, res:any, field:any)
    {
        if (err) throw err;
        console.log(res);
        if (!res.length)
            addUser(client);
        else
            getUser(client);
    })
}

//사용자가 없는 경우, user 값 생성
export function addUser(client:any){
    const cmd = `insert into user value('${user.user_id}', '${user.intra_id}', '${user.auth}', '${user.email}', '${user.phone}')`;
    client.query(cmd, (err:any, res:any, field:any)=>{
        if (err) throw err;
        console.log(res);
    });
}
//본인 정보 및 렌트 정보 - 리턴 페이지
export function getUser(client:any){    
    client.query(`select * from lent where lent_user_id=${user.user_id}`, function(err:any, res:any, field:any){
        if (err) throw err;
        console.log(res);
        console.log(typeof res);
        if (res.length !== 0) // lent page
        {
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
//cabinet 정보 가져오기 - 렌트 페이지
export function getCabinetList(client:any){
    client.query(`SELECT * FROM cabinet order by location, floor, section, cabinet_num`, (err:any, res:any, field:any)=>{
        if (err) throw err;
        let i = -1;
        while (res[++i]){
            cabinet.push({
                cabinet_id: res[i].cabinet_id,
                cabinet_num: res[i].cabinet_num,
                location: res[i].location,
                floor: res[i].floor,
                section: res[i].section,
                activation: res[i].activation,
            });
            console.log(res[i]);
        }
    });
}
//lent & user
export function getLentUser(client:any){
    const content = `select u.intra_id, l.* from user u right join lent l on l.lent_user_id=u.user_id`;
    client.query(content, (err:any, res:any, field:any)=>{
        if (err) throw err;
        console.log(res);
    });
}
//location info
export function locationInfo(client:any):Array<string>{
    const content:string = `select distinct cabinet.location from cabinet`;
    let locationList:Array<string> = [];

    client.query(content, (err:any, res:any, field:any)=>{
        if (err) throw err;
        let i = -1;
        while (res[++i]){
            locationList.push(res[i].location);
            floorInfo(client, res[i].location);
        }
        // console.log(locationList);
    });
    return locationList;
}
//floor info with exact location
export function floorInfo(client:any, location:string):Array<number>{
    const content:string = `select distinct cabinet.floor from cabinet where location='${location}' order by floor`;
    let floorList:Array<number> = [];

    client.query(content, (err:any, res:any, field:any)=>{
        if (err) throw err;
        let i = -1;
        while (res[++i]){
            floorList.push(res[i].floor);
            sectionInfo(client, location, res[i].floor);
        }
        console.log(floorList);
    });
    return floorList;
}
//section info with exact floor
export function sectionInfo(client:any, location:string, floor:number):Array<string>{
    const content:string = `select distinct cabinet.section from cabinet where location='${location}' and floor=${floor} order by section`;
    let sectionList:Array<string> = [];

    client.query(content, (err:any, res:any, field:any)=>{
        if (err) throw err;
        let i = -1;
        while (res[++i]){
            sectionList.push(res[i].section);
        }
        console.log(sectionList);
    });
    return sectionList;
}
//lent 값 생성
export function postLent(client:any){
    client.query(`INSERT INTO lent (lent_cabinet_id, lent_user_id, lent_time, expire_time, extension) VALUES (${lentForPost.lent_cabinet_id}, ${lentForPost.lent_user_id}, now(), now(), ${lentForPost.extension})`, function(err:any, res:any, field:any){
        if (err) throw err;
        console.log(res);
        console.log(typeof res);
        // console.log(res.length);
        // mysqlssh.close();
      });
      client.query(`update cabinet set activation = false where cabinet_id=${lentForPost.lent_cabinet_id}`, function(err:any, res:any, field:any){
        if (err) throw err;
        console.log(res);
        console.log(typeof res);
        // console.log(res.length);
        // mysqlssh.close();
      });
}

//lent_log 값 생성 후 lent 값 삭제 (skim update)
export function postReturn(client:any){
    client.query(`select * from lent where lent_cabinet_id=${lent.lent_cabinet_id}`, function(err:any, res:any, field:any) {
        if (err) throw err;
        if (res[0] === undefined)
            return ;
        const lent_id = res[0].lent_id;
        const user_id = res[0].lent_user_id;
        const cabinet_id = res[0].lent_cabinet_id;
        const lent_time = res[0].lent_time;
        client.query(`insert into lent_log (log_user_id, log_cabinet_id, lent_time, return_time) values
        (${user_id}, ${cabinet_id}, '${lent_time}', now())`);
        client.query(`delete from lent where lent_cabinet_id=${lent_id}`)
    });
}

