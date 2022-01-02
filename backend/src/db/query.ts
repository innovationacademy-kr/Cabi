const mysqlssh = require('mysql-ssh')

export function getUserList(client:any){
    client.query('select * from `cabinet`', function(err:any, res:any, field:any){
        if (err) throw err;
        console.log(res[0]);
        console.log(typeof res);
        console.log(res.length);
        mysqlssh.close();
    });
}