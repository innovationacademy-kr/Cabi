const mysqlssh = require('mysql-ssh')
import fs from 'fs';
import {getUserList} from './query'

export function connection(){
    mysqlssh.connect({
        host: 'cabi.42cadet.kr',
        user: 'ec2-user',
        //privateKey 작성하세요!
        privateKey: fs.readFileSync('./key/swlabs-cadet.pem')
    },{
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: '42cabi_DB'
    }).then((client:any)=>{
        getUserList;
    }).catch((err:any)=>{
        console.log(err);
        throw err;
    });
}

