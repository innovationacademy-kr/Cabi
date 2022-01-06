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

    // client.query(client.query(`SELECT * FROM cabinet c LEFT OUTER JOIN lent l ON l.lent_cabinet_id = c.cabinet_id;`));
    // 첫번째 join 저장하기
    // client.query(`SELECT u.intra_id FROM lent l inner JOIN user u ON u.user_id = l.lent_user_id;`), function(err:any, res:any, field:any) {
    // };
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
export function locationInfo(client:any):Array<locationInfo>{
    const content:string = `select distinct cabinet.location, count(distinct cabinet.floor) as floor from cabinet order by cabinet.floor`;
    let locationList:Array<locationInfo> = [];

    client.query(content, (err:any, res:any, field:any)=>{
        if (err) throw err;
        console.log(res);
        // console.log(`location = ${res[0].location}`);
        //location
        let i = -1;
        while (res[++i]){
            //floor
            const cont:any = res[i];
            const qu:string = `select c.* from cabinet c where c.location="${res[i].location}" order by c.floor, c.section`;
            client.query(qu, (err:any, resp:any, field:any)=>{
                if (err) throw err;
                locationList.push({
                    location: cont.location,
                    floor: cont.floor,
                    cabinet: resp,
                });
                console.log(resp);
            });
        }
    });
   return locationList;
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

