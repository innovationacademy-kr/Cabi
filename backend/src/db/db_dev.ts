const mysqlssh = require('mysql-ssh')
import fs from 'fs';

const db_key = {
    host: 'cabi.42cadet.kr',
    user: 'ec2-user',
    privateKey: fs.readFileSync('./src/key/swlabs-cadet.pem')
}
const db_info = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: '42cabi_DB',
    dateStrings: 'date'
}

export function connection(queryFunction:Function){
    console.log('connection');
    mysqlssh.connect(db_key, db_info).then((client:any)=>{
        console.log('connection!!');
        queryFunction(client, ()=> {
            mysqlssh.close();
        })
    }).catch((err:any)=>{
        console.log(err);
        throw err;
    });
}

export function connectionForLent(queryFunction:any, cabinet_id:number){
    console.log('connection for lent');
    mysqlssh.connect(db_key, db_info).then((client:any)=>{
        queryFunction(client, cabinet_id);
    }).catch((err:any)=>{
        console.log(err);
        throw err;
    })
}
