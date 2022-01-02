const mysqlssh = require('mysql-ssh')
import {user} from '../user'

//사용자 확인 - 사용자가 없는 경우, addUser, 있는 경우, getUser
export function checkUser(client:any){
    client.query(`select * from user where user_id = ${user.user_id}`, function(err:any, res:any, field:any)
    {
        if (err) throw err;
        console.log(res);
        if (res)
            console.log("addUser");
        else
            console.log("getUser");
    })
}
//사용자가 없는 경우, user 값 생성
export function addUser(client:any){
    
}
//본인 정보 및 렌트 정보 - 리턴 페이지
export function getUser(client:any){
    client.query(`select * from lent where user_id=${user.user_id}`, function(err:any, res:any, field:any){
        if (err) throw err;
        console.log(res);
        console.log(typeof res);
        // console.log(res.length);
        mysqlssh.close();
    });
}
//cabinet 정보 가져오기 - 렌트 페이지
export function getCabinetList(client:any){
    client.query(``)
}
//lent 값 생성
export function postLent(client:any){

}
//lent_log 값 생성 후 lent 값 삭제
export function postReturn(client:any){

}
