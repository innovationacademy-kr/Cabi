const mysqlssh = require('mysql-ssh')
import {user} from '../user'

export function getUserList(client:any){
    client.query(`select * from user where user_id=${user.user_id}`, function(err:any, res:any, field:any){
        if (err) throw err;
        console.log(res);
        console.log(typeof res);
        // console.log(res.length);
        mysqlssh.close();
    });
}